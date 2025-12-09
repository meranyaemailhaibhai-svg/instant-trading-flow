import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-signature",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET");

const PLATFORMS = [
  "XYZ Options",
  "ABC Index", 
  "Binex",
  "Quotex Pro",
  "Platform 5",
  "Platform 6"
];

const SYSTEM_PROMPT = `You are the official WhatsApp onboarding engine for a trading platform called TradeID.
Your job is to:
1. Detect when the user wants a new trading ID.
2. Guide them step-by-step through platform selection → name → UPI payment.
3. Keep messages short, clear, professional with emojis.
4. Never skip steps.
5. Never send trading IDs automatically - only admins create account credentials.

Available platforms:
1️⃣ XYZ Options
2️⃣ ABC Index
3️⃣ Binex
4️⃣ Quotex Pro
5️⃣ Platform 5
6️⃣ Platform 6

State machine:
- awaiting_platform_selection: User needs to select a platform
- awaiting_client_name: User needs to provide their name
- awaiting_payment: User needs to make payment
- payment_received: Payment confirmed, waiting for admin
- admin_processing: Admin is creating the account
- completed: Account created and credentials sent

You must respond in JSON format with:
{
  "response": "Your message to the user",
  "detected_intent": "new_id" | "platform_selection" | "name_provided" | "general" | "greeting",
  "extracted_platform": "platform name if detected" | null,
  "extracted_name": "user name if detected" | null,
  "new_state": "new state" | null
}`;

interface ConversationContext {
  state: string;
  client_name: string | null;
  selected_platform: string | null;
  whatsapp_number: string;
}

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

async function getAIResponse(message: string, context: ConversationContext) {
  const contextPrompt = `
Current conversation state: ${context.state}
Client name: ${context.client_name || "Not provided"}
Selected platform: ${context.selected_platform || "Not selected"}

User message: "${message}"

Based on the current state and user message, provide the appropriate response.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: contextPrompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI Gateway error:", response.status, errorText);
    throw new Error("AI Gateway error");
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  try {
    // Try to parse as JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", e);
  }
  
  // Fallback response
  return {
    response: content || "I'm sorry, I couldn't understand that. Please try again.",
    detected_intent: "general",
    extracted_platform: null,
    extracted_name: null,
    new_state: null
  };
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
      console.error("Invalid webhook signature - rejecting request");
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid webhook signature" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { message, whatsapp_number, webhook_data } = JSON.parse(rawBody);
    
    // Validate required fields
    if (!message || typeof message !== "string" || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Invalid message format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!whatsapp_number || typeof whatsapp_number !== "string" || !/^\+?[\d\s-]{10,20}$/.test(whatsapp_number)) {
      return new Response(
        JSON.stringify({ error: "Invalid WhatsApp number format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Received verified webhook:", { whatsapp_number });

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get or create client record
    let { data: client, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("whatsapp_number", whatsapp_number)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (clientError) {
      console.error("Error fetching client:", clientError);
    }

    // Create new client if not exists or if previous one is completed
    if (!client || client.state === "completed" || client.state === "expired") {
      const { data: newClient, error: createError } = await supabase
        .from("clients")
        .insert({
          whatsapp_number,
          state: "awaiting_platform_selection",
          payment_status: "pending"
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating client:", createError);
        throw createError;
      }
      client = newClient;
    }

    // Build context for AI
    const context: ConversationContext = {
      state: client.state,
      client_name: client.client_name,
      selected_platform: client.selected_platform,
      whatsapp_number,
    };

    // Get AI response
    const aiResponse = await getAIResponse(message, context);
    console.log("AI Response processed");

    // Determine updates to client record
    const updates: Record<string, any> = {};

    // Check for intent-based state transitions
    if (aiResponse.detected_intent === "new_id" && client.state === "awaiting_platform_selection") {
      // Send greeting and platform menu
      aiResponse.response = `Hello Sir 👋
Welcome to TradeID Trading Desk.

We provide instant trading accounts on the following platforms:

1️⃣ XYZ Options
2️⃣ ABC Index
3️⃣ Binex
4️⃣ Quotex Pro
5️⃣ Platform 5
6️⃣ Platform 6

Please reply with the platform number or name on which you want to create your trading ID.`;
    }

    // Platform selection
    if (aiResponse.extracted_platform || client.state === "awaiting_platform_selection") {
      const platformMatch = PLATFORMS.find(p => 
        message.toLowerCase().includes(p.toLowerCase()) ||
        message.includes("1") && p === "XYZ Options" ||
        message.includes("2") && p === "ABC Index" ||
        message.includes("3") && p === "Binex" ||
        message.includes("4") && p === "Quotex Pro" ||
        message.includes("5") && p === "Platform 5" ||
        message.includes("6") && p === "Platform 6"
      );

      if (platformMatch && client.state === "awaiting_platform_selection") {
        updates.selected_platform = platformMatch;
        updates.state = "awaiting_client_name";
        aiResponse.response = `Great choice sir! 👍

You selected ${platformMatch}.

Please send your full name to create your trading account.`;
      }
    }

    // Name collection
    if (client.state === "awaiting_client_name" && !client.client_name) {
      // Simple name extraction - take the message as name if it looks like a name
      const potentialName = message.trim();
      if (potentialName.length >= 2 && potentialName.length <= 100 && !/^\d+$/.test(potentialName)) {
        updates.client_name = potentialName;
        updates.state = "awaiting_payment";
        aiResponse.response = `Thank you, ${potentialName} 🙏

To create your ${client.selected_platform} trading account, please recharge your wallet using the UPI QR Code.

💰 Minimum Recharge: ₹250
📲 Payment Method: UPI QR
⚡ Instant Activation

Please scan and pay using the QR code below. After payment, share the transaction screenshot or UTR number.`;
      }
    }

    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from("clients")
        .update(updates)
        .eq("id", client.id);

      if (updateError) {
        console.error("Error updating client:", updateError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        response: aiResponse.response,
        client_id: client.id,
        state: updates.state || client.state,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in whatsapp-webhook:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        response: "I'm experiencing technical difficulties. Please try again later or contact support." 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
