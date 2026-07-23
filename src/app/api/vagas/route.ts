import { NextRequest, NextResponse } from "next/server";

const GUPY_API = "https://employability-portal.gupy.io/api/v1/jobs";

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("keyword") || "";

  try {
    const allJobs: Record<string, unknown>[] = [];
    const queries = keyword
      ? [keyword, ...keyword.split(" ").filter(Boolean)]
      : ["desenvolvedor"];

    for (const q of [...new Set(queries)]) {
      const params = new URLSearchParams({ jobName: q, limit: "20", offset: "0", sortBy: "publishedDate", sortOrder: "desc" });
      const url = `${GUPY_API}?${params}`;
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) continue;

      const data = await res.json() as GupyResponse;
      for (const job of data.data || []) {
        const id = String(job.id || "");
        if (id && !allJobs.some((j) => (j as Record<string, unknown>).id_externo === id)) {
          allJobs.push(normalizar(job));
        }
      }
    }

    return NextResponse.json({ jobs: allJobs.slice(0, 50) });
  } catch {
    return NextResponse.json({ jobs: [], error: "Erro ao buscar vagas" });
  }
}

interface GupyResponse {
  data: GupyJob[];
}

interface GupyJob {
  id: number;
  name: string;
  careerPageName: string;
  city: string;
  state: string;
  country: string;
  workplaceType: string;
  publishedDate: string;
  description: string;
  jobUrl: string;
}

function normalizar(job: GupyJob): Record<string, unknown> {
  const local = [job.city, job.state].filter(Boolean).join(", ");
  const tipo = job.workplaceType === "remote" ? "remoto"
    : job.workplaceType === "hybrid" ? "hibrido"
    : job.workplaceType === "on-site" ? "presencial" : "";

  return {
    id_externo: String(job.id),
    titulo: job.name,
    empresa: job.careerPageName || "",
    local: local || (tipo === "remoto" ? "Remoto" : ""),
    tipo,
    fonte: "gupy",
    url: job.jobUrl || `https://portal.gupy.io/job/${job.id}`,
    salario: "",
    senioridade: extrairSenioridade(job.name),
    descricao: job.description || "",
    data_publicacao: job.publishedDate || "",
  };
}

function extrairSenioridade(titulo: string): string {
  const t = titulo.toLowerCase();
  if (t.includes("senior") || t.includes("sênior") || t.includes("pleno") || t.includes("sr")) return "senior";
  if (t.includes("junior") || t.includes("júnior") || t.includes("jr") || t.includes("jr")) return "junior";
  if (t.includes("estagio") || t.includes("estágio") || t.includes("trainee")) return "estagio";
  return "";
}
