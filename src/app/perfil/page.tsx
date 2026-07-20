"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  type Mensagem,
  type PerfilCandidato,
  gerarPromptInicial,
  gerarProximaPergunta,
  extrairPerfil,
} from "@/lib/entrevista/entrevista-service";

export default function PerfilPage() {
  const [historico, setHistorico] = useState<Mensagem[]>([gerarPromptInicial()]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [perfil, setPerfil] = useState<PerfilCandidato | null>(null);
  const [editando, setEditando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [historico, perfil]);

  async function enviarMensagem() {
    if (!input.trim() || loading) return;

    const msgUser: Mensagem = { role: "user", content: input };
    const novoHistorico = [...historico, msgUser];
    setHistorico(novoHistorico);
    setInput("");
    setLoading(true);

    try {
      const resultado = await gerarProximaPergunta(novoHistorico);
      const perfilExtraido = extrairPerfil(resultado.content);

      setHistorico((prev) => [...prev, resultado]);

      if (perfilExtraido) {
        setPerfil(perfilExtraido);
      }
    } catch {
      setHistorico((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Desculpe, tive um problema. Pode tentar de novo?",
        },
      ]);
    }
    setLoading(false);
  }

  async function salvarPerfil() {
    if (!perfil) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("profiles_candidate").upsert({
      user_id: user.id,
      ...perfil,
      perfil_json: perfil,
      entrevista_completa: true,
      updated_at: new Date().toISOString(),
    });

    if (!error) {
      setSalvo(true);
    }
  }

  function reiniciar() {
    setHistorico([gerarPromptInicial()]);
    setPerfil(null);
    setEditando(false);
    setSalvo(false);
    setInput("");
  }

  if (salvo) {
    return (
      <div className="mx-auto mt-24 max-w-md px-4 text-center">
        <h1 className="mb-4 text-2xl font-bold">Perfil salvo! 🎉</h1>
        <p className="mb-8 text-zinc-600">
          Seu perfil foi gerado e está pronto. Vamos encontrar as melhores vagas!
        </p>
        <div className="flex flex-col gap-3">
          <a
            href="/vagas"
            className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Ver vagas
          </a>
          <button
            onClick={reiniciar}
            className="text-sm text-zinc-500 hover:underline"
          >
            Refazer entrevista
          </button>
        </div>
      </div>
    );
  }

  if (perfil && !editando) {
    return (
      <div className="mx-auto mt-12 max-w-lg px-4">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Seu Perfil
        </h1>
        <div className="rounded-lg border border-zinc-200 p-6">
          <PerfilView perfil={perfil} />
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={salvarPerfil}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Salvar perfil
            </button>
            <button
              onClick={() => setEditando(true)}
              className="text-sm text-zinc-500 hover:underline"
            >
              Editar manualmente
            </button>
            <button
              onClick={reiniciar}
              className="text-sm text-red-500 hover:underline"
            >
              Refazer entrevista
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (perfil && editando) {
    return (
      <div className="mx-auto mt-12 max-w-lg px-4">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Editar Perfil
        </h1>
        <PerfilEditor
          perfil={perfil}
          onSave={(p) => {
            setPerfil(p);
            setEditando(false);
          }}
          onCancel={() => setEditando(false)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-lg px-4">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Agente RH - Entrevista
      </h1>

      <div
        ref={chatRef}
        className="mb-4 flex h-96 flex-col gap-4 overflow-y-auto rounded-lg border border-zinc-200 p-4"
      >
        {historico.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-zinc-100 px-4 py-2 text-sm text-zinc-500">
              Pensando...
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviarMensagem();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua resposta..."
          disabled={loading || !!perfil}
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim() || !!perfil}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          Enviar
        </button>
        <button
          type="button"
          onClick={reiniciar}
          className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Reiniciar
        </button>
      </form>
    </div>
  );
}

function PerfilView({ perfil }: { perfil: PerfilCandidato }) {
  return (
    <div className="space-y-3 text-sm">
      <Row label="Área" value={perfil.area} />
      <Row label="Senioridade" value={perfil.senioridade} />
      <Row label="Stack" value={perfil.stack_principal.join(", ")} />
      <Row label="Experiência" value={`${perfil.experiencia_anos} anos`} />
      <Row label="Local" value={perfil.preferencia_local} />
      <Row
        label="Faixa Salarial"
        value={`R$ ${perfil.faixa_salarial.min} - R$ ${perfil.faixa_salarial.max}`}
      />
      <Row label="Contrato" value={perfil.tipo_contrato} />
      <Row label="Soft Skills" value={perfil.soft_skills.join(", ")} />
      <Row label="Keywords" value={perfil.keywords_busca.join(", ")} />
      <Row label="Inglês" value={perfil.nivel_ingles} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-zinc-100 pb-1">
      <span className="font-medium text-zinc-500">{label}</span>
      <span className="text-zinc-900">{value}</span>
    </div>
  );
}

function PerfilEditor({
  perfil,
  onSave,
  onCancel,
}: {
  perfil: PerfilCandidato;
  onSave: (p: PerfilCandidato) => void;
  onCancel: () => void;
}) {
  const [edit, setEdit] = useState({ ...perfil });

  return (
    <div className="space-y-4">
      <Campo label="Área" value={edit.area} onChange={(v) => setEdit({ ...edit, area: v })} />
      <Campo label="Senioridade" value={edit.senioridade} onChange={(v) => setEdit({ ...edit, senioridade: v })} />
      <Campo
        label="Stack (separado por vírgula)"
        value={edit.stack_principal.join(", ")}
        onChange={(v) => setEdit({ ...edit, stack_principal: v.split(",").map((s) => s.trim()) })}
      />
      <Campo
        label="Experiência (anos)"
        value={String(edit.experiencia_anos)}
        onChange={(v) => setEdit({ ...edit, experiencia_anos: Number(v) || 0 })}
      />
      <Campo label="Local preferido" value={edit.preferencia_local} onChange={(v) => setEdit({ ...edit, preferencia_local: v })} />
      <Campo label="Tipo contrato" value={edit.tipo_contrato} onChange={(v) => setEdit({ ...edit, tipo_contrato: v })} />
      <Campo label="Inglês" value={edit.nivel_ingles} onChange={(v) => setEdit({ ...edit, nivel_ingles: v })} />
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => onSave(edit)}
          className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Salvar
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-500">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
