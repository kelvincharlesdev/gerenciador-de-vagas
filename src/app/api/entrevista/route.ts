import { NextRequest, NextResponse } from "next/server";
import { gerarProximaPergunta, extrairPerfil } from "@/lib/entrevista/entrevista-service";
import type { Mensagem } from "@/lib/entrevista/entrevista-service";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { historico } = await request.json() as { historico: Mensagem[] };

  try {
    const resposta = await gerarProximaPergunta(historico);
    const perfil = extrairPerfil(resposta.content);

    return NextResponse.json({
      mensagem: resposta,
      perfil,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao processar" },
      { status: 500 },
    );
  }
}
