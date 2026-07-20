"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buscarVagas, type Vaga } from "@/lib/vagas/vagas-service";
import { calcularMatch } from "@/lib/match/match-service";
import type { PerfilCandidato } from "@/lib/entrevista/entrevista-service";

export default function DashboardPage() {
  const [perfil, setPerfil] = useState<PerfilCandidato | null>(null);
  const [topVagas, setTopVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    async function carregarDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles_candidate")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        const perfilData = profile.perfil_json as PerfilCandidato;
        setPerfil(perfilData);

        const vagas = await buscarVagas({
          keyword: perfilData.keywords_busca?.join(" ") || "",
        });

        const vagasComScore = vagas
          .map((v) => ({ ...v, score: calcularMatch(perfilData, v) }))
          .filter((v) => v.score >= 30)
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .slice(0, 5);

        setTopVagas(vagasComScore);
      }

      setLoading(false);
    }

    carregarDashboard();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="h-8 w-48 animate-pulse rounded bg-zinc-200" />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg bg-zinc-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 text-center">
        <h1 className="mb-4 text-3xl font-bold">Bem-vindo!</h1>
        <p className="mb-8 text-zinc-600">
          Você ainda não criou seu perfil. O agente RH vai te ajudar com uma
          entrevista rápida.
        </p>
        <a
          href="/perfil"
          className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Criar meu perfil
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <a
          href="/vagas"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Ver todas as vagas
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProfileCard perfil={perfil} />
        <TopVagasCard vagas={topVagas} />
        <StatsCard />
      </div>
    </div>
  );
}

function ProfileCard({ perfil }: { perfil: PerfilCandidato }) {
  return (
    <a
      href="/perfil"
      className="rounded-lg border border-zinc-200 p-5 transition-colors hover:border-zinc-300"
    >
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Resumo do Perfil
      </h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-500">Senioridade</span>
          <span className="font-medium capitalize">{perfil.senioridade}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Stack</span>
          <span className="font-medium">{perfil.stack_principal?.slice(0, 3).join(", ")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Local</span>
          <span className="font-medium capitalize">{perfil.preferencia_local}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Experiência</span>
          <span className="font-medium">{perfil.experiencia_anos} anos</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Contrato</span>
          <span className="font-medium capitalize">{perfil.tipo_contrato}</span>
        </div>
      </div>
      <div className="mt-4 text-xs text-zinc-400 hover:text-zinc-600">
        Editar perfil →
      </div>
    </a>
  );
}

function TopVagasCard({ vagas }: { vagas: Vaga[] }) {
  return (
    <a
      href="/vagas"
      className="rounded-lg border border-zinc-200 p-5 transition-colors hover:border-zinc-300"
    >
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Últimas Vagas Match
      </h2>
      {vagas.length === 0 ? (
        <p className="text-sm text-zinc-400">
          Nenhuma vaga encontrada ainda
        </p>
      ) : (
        <div className="space-y-3">
          {vagas.map((vaga) => (
            <div key={vaga.id || vaga.id_externo} className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{vaga.titulo}</p>
                <p className="text-xs text-zinc-400">{vaga.empresa}</p>
              </div>
              <span
                className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  (vaga.score || 0) >= 70
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {vaga.score}%
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 text-xs text-zinc-400 hover:text-zinc-600">
        Ver todas →
      </div>
    </a>
  );
}

function StatsCard() {
  return (
    <div className="rounded-lg border border-zinc-200 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Estatísticas
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-zinc-900">—</p>
          <p className="text-xs text-zinc-500">Vagas encontradas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-zinc-900">—</p>
          <p className="text-xs text-zinc-500">Currículos ajustados</p>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-zinc-400">
        Estatísticas completas em breve
      </p>
    </div>
  );
}
