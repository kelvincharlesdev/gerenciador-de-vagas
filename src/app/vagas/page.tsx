"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  buscarVagas,
  favoritarVaga,
  listarFavoritos,
  type Vaga,
} from "@/lib/vagas/vagas-service";
import { calcularMatch } from "@/lib/match/match-service";
import type { PerfilCandidato } from "@/lib/entrevista/entrevista-service";

export default function VagasPage() {
  const supabase = createClient();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [perfil, setPerfil] = useState<PerfilCandidato | null>(null);
  const [filtro, setFiltro] = useState({
    keyword: "",
    local: "",
    tipo_trabalho: "",
    fonte: "",
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [vagaModal, setVagaModal] = useState<Vaga | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles_candidate")
        .select("perfil_json")
        .eq("user_id", user.id)
        .single();

      if (profile?.perfil_json) {
        setPerfil(profile.perfil_json as PerfilCandidato);
        setFiltro((f) => ({
          ...f,
          keyword: (profile.perfil_json as PerfilCandidato).keywords_busca?.join(" ") || "",
        }));
      }

      const favs = await listarFavoritos(supabase, user.id);
      setFavoritos(favs);

      await carregarVagas();
    }

    init();
  }, []);

  async function carregarVagas() {
    setLoading(true);
    setError(null);

    try {
      const vagasEncontradas = await buscarVagas(supabase, {
        keyword: filtro.keyword || undefined,
        local: filtro.local || undefined,
        tipo_trabalho: filtro.tipo_trabalho || undefined,
        fonte: filtro.fonte || undefined,
      });

      const vagasComScore = perfil
        ? vagasEncontradas.map((v) => ({
            ...v,
            score: calcularMatch(perfil, v),
          })).filter((v) => v.score >= 30)
            .sort((a, b) => (b.score || 0) - (a.score || 0))
        : vagasEncontradas;

      setVagas(vagasComScore);
    } catch {
      setError("Erro ao buscar vagas. Tente novamente mais tarde.");
    }
    setLoading(false);
  }

  async function toggleFavorito(vagaId: string) {
    if (!userId) return;
    const isFav = favoritos.includes(vagaId);
    await favoritarVaga(supabase, userId, vagaId, !isFav);

    setFavoritos((prev) =>
      isFav ? prev.filter((id) => id !== vagaId) : [...prev, vagaId],
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Vagas</h1>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          placeholder="Palavra-chave"
          value={filtro.keyword}
          onChange={(e) => setFiltro({ ...filtro, keyword: e.target.value })}
          className="flex-1 min-w-[200px] rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Local"
          value={filtro.local}
          onChange={(e) => setFiltro({ ...filtro, local: e.target.value })}
          className="w-40 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
        <select
          value={filtro.tipo_trabalho}
          onChange={(e) => setFiltro({ ...filtro, tipo_trabalho: e.target.value })}
          className="w-40 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">Todos os tipos</option>
          <option value="remoto">Remoto</option>
          <option value="presencial">Presencial</option>
          <option value="hibrido">Híbrido</option>
        </select>
        <select
          value={filtro.fonte}
          onChange={(e) => setFiltro({ ...filtro, fonte: e.target.value })}
          className="w-36 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">Todas fontes</option>
          <option value="gupy">Gupy</option>
          <option value="linkedin">LinkedIn</option>
        </select>
        <button
          onClick={carregarVagas}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg border border-zinc-200 bg-zinc-50"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && vagas.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-16 text-center">
          <p className="mb-2 text-lg font-medium text-zinc-600">
            Nenhuma vaga encontrada
          </p>
          <p className="text-sm text-zinc-400">
            Tente ajustar os filtros ou crie seu perfil no agente RH para
            buscar vagas compatíveis.
          </p>
          <a
            href="/perfil"
            className="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Criar meu perfil
          </a>
        </div>
      )}

      {!loading && !error && vagas.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vagas.map((vaga) => (
            <VagaCard
              key={vaga.id || vaga.id_externo}
              vaga={vaga}
              isFavorito={favoritos.includes(vaga.id)}
              onToggleFavorito={() => toggleFavorito(vaga.id)}
              onDetalhes={() => setVagaModal(vaga)}
            />
          ))}
        </div>
      )}

      {vagaModal && (
        <VagaModal vaga={vagaModal} onClose={() => setVagaModal(null)} />
      )}
    </div>
  );
}

function VagaCard({
  vaga,
  isFavorito,
  onToggleFavorito,
  onDetalhes,
}: {
  vaga: Vaga;
  isFavorito: boolean;
  onToggleFavorito: () => void;
  onDetalhes: () => void;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-300">
      <div className="mb-2 flex items-start justify-between">
        <h2 className="text-sm font-semibold leading-tight">{vaga.titulo}</h2>
        {vaga.score != null && (
          <span
            className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
              vaga.score >= 70
                ? "bg-emerald-100 text-emerald-700"
                : vaga.score >= 50
                  ? "bg-amber-100 text-amber-700"
                  : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {vaga.score}%
          </span>
        )}
      </div>

      <p className="mb-1 text-xs text-zinc-500">{vaga.empresa}</p>

      <div className="mb-3 flex flex-wrap gap-1 text-xs text-zinc-400">
        {vaga.local && <span>{vaga.local}</span>}
        {vaga.local && vaga.tipo && <span>•</span>}
        {vaga.tipo && <span>{vaga.tipo}</span>}
        <span className="ml-auto rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-500">
          {vaga.fonte}
        </span>
      </div>

      {vaga.score != null && vaga.score >= 30 && (
        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className={`h-full rounded-full transition-all ${
              vaga.score >= 70
                ? "bg-emerald-500"
                : vaga.score >= 50
                  ? "bg-amber-500"
                  : "bg-zinc-300"
            }`}
            style={{ width: `${vaga.score}%` }}
          />
        </div>
      )}

      <div className="mt-auto flex gap-2">
        <button
          onClick={onDetalhes}
          className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-xs hover:bg-zinc-50"
        >
          Detalhes
        </button>
        <a
          href={vaga.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-md bg-zinc-900 px-3 py-1.5 text-center text-xs text-white hover:bg-zinc-700"
        >
          Candidatar-se
        </a>
        <button
          onClick={onToggleFavorito}
          className={`rounded-md px-3 py-1.5 text-xs ${
            isFavorito
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "border border-zinc-300 hover:bg-zinc-50"
          }`}
        >
          {isFavorito ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
}

function VagaModal({
  vaga,
  onClose,
}: {
  vaga: Vaga;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">{vaga.titulo}</h2>
            <p className="text-sm text-zinc-500">{vaga.empresa}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-zinc-100"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2 text-xs text-zinc-500">
          {vaga.local && (
            <span className="rounded bg-zinc-100 px-2 py-1">{vaga.local}</span>
          )}
          {vaga.tipo && (
            <span className="rounded bg-zinc-100 px-2 py-1">{vaga.tipo}</span>
          )}
          {vaga.salario && (
            <span className="rounded bg-zinc-100 px-2 py-1">
              {vaga.salario}
            </span>
          )}
          <span className="rounded bg-zinc-100 px-2 py-1">{vaga.fonte}</span>
        </div>

        {vaga.descricao && (
          <p className="mb-4 text-sm leading-relaxed text-zinc-700">
            {vaga.descricao}
          </p>
        )}

        <div className="flex gap-3">
          <a
            href={vaga.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-zinc-700"
          >
            Candidatar-se no site original
          </a>
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
