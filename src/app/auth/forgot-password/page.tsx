"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth/errors";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/reset-password`,
    });

    if (error) {
      setMessage(translateAuthError(error.message));
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="mx-auto mt-24 max-w-sm px-4 text-center">
        <h1 className="mb-4 text-2xl font-bold">Verifique seu email</h1>
        <p className="text-zinc-600">
          Enviamos um link de recuperação para <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-24 max-w-sm px-4">
      <h1 className="mb-8 text-center text-2xl font-bold">
        Recuperar senha
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar link"}
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-sm text-red-600">{message}</p>
      )}
    </div>
  );
}
