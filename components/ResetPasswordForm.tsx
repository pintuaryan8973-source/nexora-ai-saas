"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.replace("/dashboard?password=updated");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm text-white/60">New password</span>
        <span className="relative block">
          <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
          <input name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={8} placeholder="Minimum 8 characters" className="h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-10 pr-11 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/60" />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </span>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-white/60">Confirm new password</span>
        <input name="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={8} placeholder="Repeat new password" className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/60" />
      </label>
      {error ? <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p> : null}
      <button disabled={loading} className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-sm font-medium transition hover:from-violet-500 hover:to-violet-400 disabled:opacity-60">
        {loading ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
