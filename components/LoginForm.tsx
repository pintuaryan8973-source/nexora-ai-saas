"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogle() {
    setGoogleLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) throw error;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Google sign-in could not start.");
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = new FormData(event.currentTarget);
      const email = String(form.get("email") ?? "").trim();
      const password = String(form.get("password") ?? "");
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      router.replace(next);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign in failed.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading || loading}
        className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleIcon />
        {googleLoading ? "Connecting to Google..." : "Continue with Google"}
      </button>

      <div className="my-6 flex items-center gap-3 text-xs text-white/30">
        <div className="h-px flex-1 bg-white/10" /> OR <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm text-white/60">Email</span>
          <span className="relative block">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-10 pr-4 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/60" />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 flex items-center justify-between text-sm text-white/60">
            Password
            <Link href="/forgot-password" className="text-xs text-violet-300 hover:text-violet-200">Forgot password?</Link>
          </span>
          <span className="relative block">
            <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required placeholder="Enter your password" className="h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-10 pr-11 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/60" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </span>
        </label>

        {error ? <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p> : null}

        <button disabled={loading || googleLoading} className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-sm font-medium transition hover:from-violet-500 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/45">
        New to Nexora? <Link href="/signup" className="font-medium text-violet-300 hover:text-violet-200">Create free account</Link>
      </p>
    </>
  );
}
