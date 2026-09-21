"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <AuthShell title="Reset your password" description="We’ll send a secure password recovery link to your email.">
      {sent ? (
        <div className="mt-7 space-y-5 text-center">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm leading-6 text-emerald-200">
            If an account exists for that email, a recovery link has been sent. Check your inbox and spam folder.
          </div>
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-violet-300 hover:text-violet-200"><ArrowLeft className="size-4" /> Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-white/60">Email</span>
            <span className="relative block">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
              <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-10 pr-4 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/60" />
            </span>
          </label>

          {error ? <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p> : null}

          <button disabled={loading} className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-sm font-medium transition hover:from-violet-500 hover:to-violet-400 disabled:opacity-60">
            {loading ? "Sending..." : "Send recovery link"}
          </button>
          <Link href="/login" className="flex items-center justify-center gap-2 pt-2 text-sm text-white/45 hover:text-white"><ArrowLeft className="size-4" /> Back to sign in</Link>
        </form>
      )}
    </AuthShell>
  );
}
