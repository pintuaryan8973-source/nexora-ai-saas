"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, LogOut, Settings, Sparkles, Workflow, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardShell({ name, email }: { name: string; email: string }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <header className="border-b border-white/10 bg-black/30 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl border border-violet-400/25 bg-violet-500/15 text-violet-300"><Sparkles className="size-4" /></span>
            <span className="font-semibold">Nexora <span className="text-violet-300">AI</span></span>
          </Link>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/70 hover:bg-white/[0.08] hover:text-white">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-violet-300">Protected workspace</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Welcome, {name}</h1>
        <p className="mt-2 text-white/45">Signed in as {email}</p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: Bot, title: "AI Copilot", text: "Ask questions across your connected workspace." },
            { icon: Workflow, title: "Workflows", text: "Build repeatable automations for everyday work." },
            { icon: Zap, title: "Automations", text: "Turn routine tasks into fast, reliable actions." },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <span className="grid size-11 place-items-center rounded-2xl bg-violet-500/10 text-violet-300"><Icon className="size-5" /></span>
              <h2 className="mt-5 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/45">{text}</p>
              <span className="mt-5 inline-block rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/35">Coming next</span>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/40 to-white/[0.025] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/60"><Settings className="size-5" /></span>
            <div>
              <h2 className="text-lg font-semibold">Account foundation is ready</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">Google sign-in, email/password auth, email verification, password recovery, secure cookie sessions, protected routes, and sign out are wired for Supabase.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
