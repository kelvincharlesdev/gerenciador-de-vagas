export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="mb-4 text-4xl font-bold tracking-tight">
        Buscador de Vagas
      </h1>
      <p className="mb-8 max-w-lg text-lg text-zinc-600">
        Um agente de IA especialista em RH entrevista você, busca vagas em
        múltiplas fontes e calcula o match perfeito.
      </p>
      <a
        href="/login"
        className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        Começar
      </a>
    </div>
  );
}
