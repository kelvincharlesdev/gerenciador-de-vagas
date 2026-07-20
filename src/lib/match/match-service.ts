import type { PerfilCandidato } from "@/lib/entrevista/entrevista-service";
import type { Vaga } from "@/lib/vagas/vagas-service";

const PESOS = {
  stack_overlap: 0.35,
  senioridade: 0.25,
  local: 0.20,
  tipo_contrato: 0.10,
  faixa_salarial: 0.10,
};

export interface ScoreDetalhado {
  total: number;
  stack_overlap: number;
  senioridade: number;
  local: number;
  tipo_contrato: number;
  faixa_salarial: number;
}

export function calcularMatch(
  perfil: PerfilCandidato,
  vaga: Vaga,
): number {
  const detalhe = calcularScoreDetalhado(perfil, vaga);
  return Math.round(detalhe.total);
}

export function calcularScoreDetalhado(
  perfil: PerfilCandidato,
  vaga: Vaga,
): ScoreDetalhado {
  const stackScore = calcularStackOverlap(
    perfil.stack_principal,
    vaga.keywords_busca,
    vaga.titulo,
    vaga.descricao,
  );

  const senioridadeScore = calcularSenioridade(perfil.senioridade, vaga);
  const localScore = calcularLocal(perfil.preferencia_local, vaga.local);
  const contratoScore = calcularContrato(perfil.tipo_contrato, vaga.tipo);
  const salarioScore = calcularSalario(perfil.faixa_salarial, vaga.salario);

  const total =
    stackScore * PESOS.stack_overlap +
    senioridadeScore * PESOS.senioridade +
    localScore * PESOS.local +
    contratoScore * PESOS.tipo_contrato +
    salarioScore * PESOS.faixa_salarial;

  return {
    total: Math.min(total * 100, 100),
    stack_overlap: Math.round(stackScore * 100),
    senioridade: Math.round(senioridadeScore * 100),
    local: Math.round(localScore * 100),
    tipo_contrato: Math.round(contratoScore * 100),
    faixa_salarial: Math.round(salarioScore * 100),
  };
}

function calcularStackOverlap(
  stack: string[],
  keywords: string[],
  titulo: string,
  descricao: string,
): number {
  if (stack.length === 0) return 0.5;

  const textoVaga = [titulo, descricao, ...keywords]
    .join(" ")
    .toLowerCase();

  const matched = stack.filter((tech) => textoVaga.includes(tech.toLowerCase()));
  return matched.length / stack.length;
}

const NIVEL_SENIORIDADE: Record<string, number> = {
  estagio: 0,
  junior: 1,
  pleno: 2,
  senior: 3,
  especialista: 4,
};

function calcularSenioridade(senioridade: string, vaga: Vaga): number {
  const nivelPerfil = NIVEL_SENIORIDADE[senioridade.toLowerCase()];
  if (nivelPerfil === undefined) return 0.5;

  const nivelVaga = vaga.senioridade
    ? NIVEL_SENIORIDADE[vaga.senioridade.toLowerCase()]
    : undefined;

  if (nivelVaga === undefined) {
    const textoVaga = `${vaga.titulo} ${vaga.descricao}`.toLowerCase();
    for (const [key, val] of Object.entries(NIVEL_SENIORIDADE)) {
      if (textoVaga.includes(key)) {
        return nivelPerfil === val ? 1 : Math.abs(nivelPerfil - val) <= 1 ? 0.7 : 0;
      }
    }
    return 0.5;
  }

  if (nivelPerfil === nivelVaga) return 1;
  if (Math.abs(nivelPerfil - nivelVaga) <= 1) return 0.7;
  return 0;
}

function calcularLocal(
  preferencia: string,
  localVaga: string,
): number {
  if (!localVaga) return 0.5;
  if (!preferencia) return 0.5;

  const pref = preferencia.toLowerCase();
  const local = localVaga.toLowerCase();

  if (pref === "remoto") return 1;
  if (pref === "hibrido" && local.includes("hibrido")) return 1;
  if (pref === "presencial" && local.includes("presencial")) return 1;
  if (pref === "hibrido" || pref === "presencial") return 0.7;

  return 0.5;
}

function calcularContrato(tipoPerfil: string, tipoVaga: string): number {
  if (!tipoVaga) return 0.5;
  if (!tipoPerfil) return 0.5;

  return tipoPerfil.toLowerCase() === tipoVaga.toLowerCase() ? 1 : 0.3;
}

function calcularSalario(
  faixa: { min: number; max: number },
  salarioTexto: string,
): number {
  if (!salarioTexto) return 0.5;

  const numeros = salarioTexto.match(/\d+/g);
  if (!numeros) return 0.5;

  const salarioVaga = parseInt(numeros[0], 10);
  if (!salarioVaga) return 0.5;

  if (faixa.max === 0 && faixa.min === 0) return 0.5;

  if (salarioVaga >= faixa.min && salarioVaga <= faixa.max) return 1;
  if (salarioVaga >= faixa.min * 0.8) return 0.7;

  return 0.3;
}
