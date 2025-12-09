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
    const { client_id, trading_id, password, login_url, support_contact } = await req.json();
    
    console.log("Sending credentials to client:", client_id);

    if (!client_id || !trading_id || !password || !login_url) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get client details
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", client_id)
      .single();

    if (clientError || !client) {
      return new Response(
        JSON.stringify({ error: "Client not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update client with credentials
    const { error: updateError } = await supabase
      .from("clients")
      .update({
        trading_id,
        trading_password: password,
        login_url,
        state: "completed",
        admin_assigned: true,
      })
      .eq("id", client_id);

    if (updateError) {
      console.error("Error updating client:", updateError);
      throw updateError;
    }

    // Prepare the message to send to client
    const clientMessage = `Dear ${client.client_name || "Sir"},

Your ${client.selected_platform || "Trading"} Account has been activated! 🎉

🔐 Trading ID: ${trading_id}
🔑 Password: ${password}
🌐 Login Link: ${login_url}
📞 Support: ${support_contact || "+91 99999 99999"}

Happy Trading! 🚀

⚠️ Please change your password after first login for security.`;

    console.log("Credentials sent successfully to client:", client_id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Credentials saved and notification prepared",
        whatsapp_message: clientMessage,
        whatsapp_number: client.whatsapp_number,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in send-credentials:", error);
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
