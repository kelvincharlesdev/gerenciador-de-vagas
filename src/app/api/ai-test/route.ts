import { callAI } from "@/lib/ai/ai-service";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "OPENROUTER_API_KEY não configurada" },
      { status: 400 },
    );
  }

  try {
    const result = await callAI("Responda apenas: 'OK - IA configurada!'", {
      temperature: 0,
      maxTokens: 50,
    });

    return Response.json({ success: true, response: result });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    );
  }
}
