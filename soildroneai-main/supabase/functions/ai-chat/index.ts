import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are the SoilGuard AI Farm Assistant — an expert in smart agriculture, drone operations, soil analysis, crop health, pest detection, irrigation, and sustainable farming. You help farmers make data-driven decisions.

Key context about the farm:
- 4 zones: Zone A (Wheat), Zone B (Corn), Zone C (Rice), Zone D (Soy)
- Current soil moisture: Zone A 58%, Zone B 72%, Zone C 45%, Zone D 68%
- NDVI scores: Zone A 0.74, Zone B 0.81, Zone C 0.62, Zone D 0.55
- Temperature: 24°C, Humidity: 58%, Air Quality Index: 42
- Active drones: SG-Alpha (flying, 78% battery), SG-Beta (charging, 45%)
- Recent alerts: Aphid infestation in Zone B, Leaf blight in Zone A
- Water level: 78%, Eco score: 82/100

Keep responses concise, actionable, and farmer-friendly. Use specific data when available. If asked about something outside agriculture/drone topics, gently redirect.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: apiMessages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "AI service unavailable", reply: "I'm having trouble connecting right now. Please try again in a moment." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal error", reply: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
