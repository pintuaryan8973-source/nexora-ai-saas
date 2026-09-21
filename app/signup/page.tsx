"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import GoogleIcon from "@/components/GoogleIcon";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordChecks = useMemo(() => ({
    length: password.length >= 8,
    letter: /[A-Za-z]/.test(password),
    number: /\d/.test(password),
  }), [password]);

  async function handleGoogle() {
    setGoogleLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const passwordValue = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (passwordValue !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!passwordChecks.length || !passwordChecks.letter || !passwordChecks.number) {
      setError("Use at least 8 characters with a letter and a number.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password: passwordValue,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    router.push("/check-email");
  }

  return (
    <AuthShell title="Create your account" description="Start free. Your workspace is ready in a few seconds.">
      <button type="button" onClick={handleGoogle} disabled={googleLoading || loading} className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60">
        <GoogleIcon />
        {googleLoading ? "Connecting to Google..." : "Continue with Google"}
      </button>

      <div className="my-6 flex items-center gap-3 text-xs text-white/30">
        <div className="h-px flex-1 bg-white/10" /> OR <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm text-white/60">Full name</span>
          <span className="relative block">
            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <input name="fullName" type="text" autoComplete="name" required placeholder="Your name" className="h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-10 pr-4 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/60" />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-white/60">Email</span>
          <span className="relative block">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-10 pr-4 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/60" />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-white/60">Password</span>
          <span className="relative block">
            <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <input name="password" value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} autoComplete="new-password" required placeholder="Minimum 8 characters" className="h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-10 pr-11 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/60" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-white/60">Confirm password</span>
          <input name="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" required placeholder="Repeat your password" className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/60" />
        </label>

        <div className="grid grid-cols-3 gap-2 text-[11px] text-white/40">
          {[['length','8+ chars'],['letter','Letter'],['number','Number']].map(([key,label]) => (
            <span key={key} className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-2 ${passwordChecks[key as keyof typeof passwordChecks] ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border-white/10 bg-white/[0.03]'}`}>
              <Check className="size-3" /> {label}
            </span>
          ))}
        </div>

        <label className="flex items-start gap-2 text-xs leading-5 text-white/45">
          <input name="terms" type="checkbox" required className="mt-1 accent-violet-500" />
          <span>I agree to the Terms of Service and Privacy Policy.</span>
        </label>

        {error ? <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p> : null}

        <button disabled={loading || googleLoading} className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-sm font-medium transition hover:from-violet-500 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Creating account..." : "Create free account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/45">
        Already have an account? <Link href="/login" className="font-medium text-violet-300 hover:text-violet-200">Sign in</Link>
      </p>
    </AuthShell>
  );
}
