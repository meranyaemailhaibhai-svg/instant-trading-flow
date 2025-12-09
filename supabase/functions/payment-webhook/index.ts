import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookData = await req.json();
    
    console.log("Payment webhook received:", JSON.stringify(webhookData, null, 2));

    // Extract payment details from webhook
    // This structure will vary based on your UPI payment provider
    const {
      amount,
      payer_name,
      upi_transaction_id,
      phone_number,
      timestamp,
    } = webhookData;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find matching client based on phone number or recent pending payments
    let { data: client, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("payment_status", "pending")
      .eq("state", "awaiting_payment")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // If phone number provided, try to match more specifically
    if (phone_number) {
      const { data: phoneClient } = await supabase
        .from("clients")
        .select("*")
        .eq("whatsapp_number", phone_number)
        .eq("payment_status", "pending")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (phoneClient) {
        client = phoneClient;
      }
    }

    if (!client) {
      console.log("No matching client found for payment");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "No matching client found" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        client_id: client.id,
        amount: amount || 250,
        upi_transaction_id,
        payer_name,
        payment_timestamp: timestamp || new Date().toISOString(),
        webhook_raw_data: webhookData,
        status: "paid",
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Error creating payment:", paymentError);
      throw paymentError;
    }

    // Update client status
    const { error: updateError } = await supabase
      .from("clients")
      .update({
        payment_status: "paid",
        payment_amount: amount || 250,
        transaction_id: upi_transaction_id,
        wallet_amount: (client.wallet_amount || 0) + (amount || 250),
        state: "payment_received",
      })
      .eq("id", client.id);

    if (updateError) {
      console.error("Error updating client:", updateError);
      throw updateError;
    }

    console.log("Payment processed successfully for client:", client.id);

    // Prepare notification messages
    const adminNotification = `⚡ NEW PAYMENT RECEIVED ⚡

Client Name: ${client.client_name || "Unknown"}
Platform: ${client.selected_platform || "Unknown"}
Amount Paid: ₹${amount || 250}
Txn ID: ${upi_transaction_id || "N/A"}
Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

Please create the trading account and send credentials to the client.`;

    const clientNotification = `Thank you, ${client.client_name || "Sir"} 🙏

Your payment of ₹${amount || 250} has been successfully received.

Our team is now creating your ${client.selected_platform || "trading"} account.
You will receive your login ID and password shortly.`;

    return new Response(
      JSON.stringify({
        success: true,
        client_id: client.id,
        payment_id: payment.id,
        admin_notification: adminNotification,
        client_notification: clientNotification,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in payment-webhook:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
