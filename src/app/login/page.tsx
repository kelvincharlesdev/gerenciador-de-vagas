"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth/errors";

type Mode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(translateAuthError(error.message));
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });

      if (error) {
        setMessage(translateAuthError(error.message));
      } else {
        setMessage("Conta criada! Faça login para continuar.");
      }
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-24 max-w-sm px-4">
      <div className="mb-8 flex rounded-lg border border-zinc-300 p-1 text-sm">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 rounded-md py-2 text-center font-medium transition-colors ${
            mode === "login" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          Entrar
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-md py-2 text-center font-medium transition-colors ${
            mode === "signup" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          Cadastrar
        </button>
      </div>

      <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
        </button>

        {mode === "login" && (
          <a
            href="/auth/forgot-password"
            className="text-center text-xs text-zinc-500 hover:underline"
          >
            Esqueceu a senha?
          </a>
        )}
      </form>



      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            message.includes("Verifique") ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
