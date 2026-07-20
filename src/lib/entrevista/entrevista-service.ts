import { callAI } from "@/lib/ai/ai-service";

export interface Mensagem {
  role: "assistant" | "user";
  content: string;
}

export interface PerfilCandidato {
  area: string;
  stack_principal: string[];
  senioridade: string;
  experiencia_anos: number;
  preferencia_local: string;
  faixa_salarial: { min: number; max: number };
  tipo_contrato: string;
  soft_skills: string[];
  keywords_busca: string[];
  nivel_ingles: string;
}

export const MAX_PERGUNTAS = 8;

const SYSTEM_PROMPT = `Você é um consultor de RH sênior especializado em TI.

Seu objetivo é extrair o perfil completo de um candidato através de uma conversa natural.

REGRAS:
- Faça perguntas naturais, como um consultor de RH faria
- Máximo de ${MAX_PERGUNTAS} perguntas
- Adapte as próximas perguntas com base nas respostas anteriores
- Se detectar contradições (ex: "sou pleno" + "tenho 6 meses de experiência"), questione educadamente
- Quando tiver informações suficientes, encerre com "Obrigado! Vou gerar seu perfil..."
- Na ÚLTIMA resposta, retorne APENAS um JSON válido sem formatação markdown

CAMPOS A EXTRAIR (retorne todos no JSON final):
- area (desenvolvimento | dados | infra | QA | design | produto)
- stack_principal (array de tecnologias)
- senioridade (estagio | junior | pleno | senior | especialista)
- experiencia_anos (número)
- preferencia_local (remoto | presencial | hibrido)
- faixa_salarial (objeto { min, max })
- tipo_contrato (CLT | PJ | estagio)
- soft_skills (array)
- keywords_busca (termos para buscar vagas)
- nivel_ingles (basico | intermediario | avancado | fluente)`;

export function gerarPromptInicial(): Mensagem {
  return {
    role: "assistant",
    content:
      "Olá! Vou te ajudar a encontrar a vaga ideal. Me conta: qual área de TI você atua? (desenvolvimento, dados, infra, QA, design ou produto)",
  };
}

export async function gerarProximaPergunta(
  historico: Mensagem[],
): Promise<Mensagem> {
  const mensagens = [
    { role: "system", content: SYSTEM_PROMPT },
    ...historico.map((m) => ({ role: m.role, content: m.content })),
    {
      role: "system",
      content: `Você já fez ${historico.filter((m) => m.role === "assistant" && !m.content.includes("Obrigado")).length} perguntas. Se já tiver informações suficientes para gerar o JSON, encerre. Caso contrário, faça a próxima pergunta.`,
    },
  ];

  const resposta = await callAI(
    mensagens.map((m) => m.content).join("\n"),
    {
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 500,
    },
  );

  return { role: "assistant", content: resposta };
}

export function extrairPerfil(resposta: string): PerfilCandidato | null {
  const jsonMatch = resposta.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    const data = JSON.parse(jsonMatch[0]);

    return {
      area: data.area || "",
      stack_principal: Array.isArray(data.stack_principal) ? data.stack_principal : [],
      senioridade: data.senioridade || "",
      experiencia_anos: Number(data.experiencia_anos) || 0,
      preferencia_local: data.preferencia_local || "",
      faixa_salarial: {
        min: Number(data.faixa_salarial?.min) || 0,
        max: Number(data.faixa_salarial?.max) || 0,
      },
      tipo_contrato: data.tipo_contrato || "",
      soft_skills: Array.isArray(data.soft_skills) ? data.soft_skills : [],
      keywords_busca: Array.isArray(data.keywords_busca) ? data.keywords_busca : [],
      nivel_ingles: data.nivel_ingles || "",
    };
  } catch {
    return null;
  }
}

export function contarPerguntas(historico: Mensagem[]): number {
  return historico.filter(
    (m) => m.role === "assistant" && !m.content.includes("Obrigado"),
  ).length;
}
