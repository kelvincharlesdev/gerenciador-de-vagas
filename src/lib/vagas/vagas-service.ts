import { createClient } from "@/lib/supabase/server";

const VAGAS_API_BASE = "https://vagas-api.henriquesebastiao.com";

interface VagaRaw {
  id?: string;
  id_externo?: string;
  titulo?: string;
  title?: string;
  empresa?: string;
  company?: string;
  local?: string;
  location?: string;
  tipo?: string;
  type?: string;
  fonte?: string;
  source?: string;
  url?: string;
  link?: string;
  salario?: string;
  salary?: string;
  senioridade?: string;
  level?: string;
  descricao?: string;
  description?: string;
  data_publicacao?: string;
  published_at?: string;
  keywords_busca?: string[];
  raw_json?: VagaRaw;
}

export interface Vaga {
  id: string;
  id_externo: string;
  titulo: string;
  empresa: string;
  local: string;
  tipo: string;
  fonte: string;
  url: string;
  salario: string;
  senioridade: string;
  descricao: string;
  keywords_busca: string[];
  data_publicacao: string;
  score?: number;
}

export interface VagasFiltro {
  keyword?: string;
  local?: string;
  tipo_trabalho?: string;
  fonte?: string;
  senioridade?: string;
}

export async function buscarVagas(
  filtro: VagasFiltro,
): Promise<Vaga[]> {
  const supabase = await createClient();

  const { data: cached } = await supabase
    .from("vagas_cache")
    .select("*")
    .contains("keywords_busca", [filtro.keyword || ""])
    .gte("expires_at", new Date().toISOString())
    .limit(50);

  if (cached && cached.length > 0) {
    return cached.map(formatarVaga);
  }

  const params = new URLSearchParams();
  if (filtro.keyword) params.set("keyword", filtro.keyword);
  params.set("limit", "50");

  const response = await fetch(`${VAGAS_API_BASE}/jobs?${params}`);
  if (!response.ok) return [];

  const data = await response.json();
  const vagas: VagaRaw[] = Array.isArray(data) ? data : data.jobs || [];

  const vagasFormatadas = vagas.map((v: VagaRaw) => ({
    id_externo: String(v.id || v.id_externo || crypto.randomUUID()),
    titulo: v.titulo || v.title || "",
    empresa: v.empresa || v.company || "",
    local: v.local || v.location || "",
    tipo: v.tipo || v.type || "",
    fonte: v.fonte || v.source || "gupy",
    url: v.url || v.link || "",
    salario: v.salario || v.salary || "",
    senioridade: v.senioridade || v.level || "",
    descricao: v.descricao || v.description || "",
    keywords_busca: [filtro.keyword || ""],
    data_publicacao: v.data_publicacao || v.published_at || new Date().toISOString(),
    raw_json: v,
  }));

  if (vagasFormatadas.length > 0) {
    await supabase.from("vagas_cache").upsert(
      vagasFormatadas.map((v) => ({
        ...v,
        expires_at: new Date(Date.now() + 3600000).toISOString(),
      })),
      { onConflict: "id_externo" },
    );
  }

  return vagasFormatadas.map(formatarVaga);
}

function formatarVaga(v: Record<string, unknown>): Vaga {
  return {
    id: String(v.id || ""),
    id_externo: String(v.id_externo || ""),
    titulo: String(v.titulo || ""),
    empresa: String(v.empresa || ""),
    local: String(v.local || ""),
    tipo: String(v.tipo || ""),
    fonte: String(v.fonte || ""),
    url: String(v.url || ""),
    salario: String(v.salario || ""),
    senioridade: String(v.senioridade || ""),
    descricao: String(v.descricao || ""),
    keywords_busca: Array.isArray(v.keywords_busca) ? v.keywords_busca as string[] : [],
    data_publicacao: String(v.data_publicacao || ""),
  };
}

export async function favoritarVaga(
  userId: string,
  vagaId: string,
  favorito: boolean,
) {
  const supabase = await createClient();

  if (favorito) {
    await supabase.from("vagas_favoritas").upsert(
      { user_id: userId, vaga_id: vagaId },
      { onConflict: "user_id, vaga_id" },
    );
  } else {
    await supabase
      .from("vagas_favoritas")
      .delete()
      .eq("user_id", userId)
      .eq("vaga_id", vagaId);
  }
}

export async function listarFavoritos(
  userId: string,
): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vagas_favoritas")
    .select("vaga_id")
    .eq("user_id", userId);

  return data?.map((f) => f.vaga_id) || [];
}
