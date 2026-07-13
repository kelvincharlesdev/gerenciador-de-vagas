"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/use-user";

export function AuthButton() {
  const { user, loading } = useUser();
  const router = useRouter();
  const supabase = createClient();

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
          className="rounded-lg border border-zinc-300 px-3 py-1 text-xs transition-colors hover:bg-zinc-50"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <a href="/login" className="hover:underline">
      Entrar
    </a>
  );
}
