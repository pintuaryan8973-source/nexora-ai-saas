import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export default function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05050a] px-4 py-10 text-white sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-[-14rem] size-[38rem] -translate-x-1/2 rounded-full bg-violet-700/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-72 rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <section className="hidden lg:block">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl border border-violet-400/25 bg-violet-500/15 text-violet-300">
              <Sparkles className="size-5" />
            </span>
            <span className="text-xl font-semibold">Nexora <span className="text-violet-300">AI</span></span>
          </Link>

          <h2 className="mt-10 max-w-lg text-5xl font-semibold tracking-[-0.04em]">
            One secure account for your entire AI workspace.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/55">
            Sign in once, keep your session securely in cookies, and access protected Nexora workspaces on desktop and mobile.
          </p>

          <div className="mt-8 grid max-w-lg gap-3">
            {["Google + email/password authentication", "Email verification and password recovery", "Protected dashboard with secure sign out"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white/70">
                <ShieldCheck className="size-4 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-7 flex items-center justify-center gap-2.5 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl border border-violet-400/25 bg-violet-500/15 text-violet-300">
              <Sparkles className="size-5" />
            </span>
            <span className="text-xl font-semibold">Nexora <span className="text-violet-300">AI</span></span>
          </Link>

          <div className="rounded-[1.75rem] border border-white/10 bg-[#0b0b12]/85 p-6 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-8">
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-white/50">{description}</p>
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
