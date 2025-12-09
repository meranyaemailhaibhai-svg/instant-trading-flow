import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-signature",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET");

// Verify webhook signature using HMAC-SHA256
async function verifyWebhookSignature(body: string, signature: string | null): Promise<boolean> {
  if (!WEBHOOK_SECRET) {
    console.warn("WEBHOOK_SECRET not configured - webhook signature validation disabled");
    return false; // Fail closed when secret not configured
  }

  if (!signature) {
    console.error("No webhook signature provided");
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const expectedSignature = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Constant-time comparison to prevent timing attacks
    if (signature.length !== expectedSignature.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < signature.length; i++) {
      result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }
    return result === 0;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Read raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature");

    // Verify webhook signature
    const isValidSignature = await verifyWebhookSignature(rawBody, signature);
    if (!isValidSignature) {
      console.error("Invalid payment webhook signature - rejecting request");
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid webhook signature" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const webhookData = JSON.parse(rawBody);
    
    console.log("Payment webhook received with valid signature");

    // Extract payment details from webhook
    // This structure will vary based on your UPI payment provider
    const {
      amount,
      payer_name,
      upi_transaction_id,
      phone_number,
      timestamp,
    } = webhookData;

    // Validate required fields
    if (typeof amount !== "number" || amount <= 0 || amount > 1000000) {
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
    if (phone_number && typeof phone_number === "string") {
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
        upi_transaction_id: upi_transaction_id ? String(upi_transaction_id).slice(0, 100) : null,
        payer_name: payer_name ? String(payer_name).slice(0, 100) : null,
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
        transaction_id: upi_transaction_id ? String(upi_transaction_id).slice(0, 100) : null,
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
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
