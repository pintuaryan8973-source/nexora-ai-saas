import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Sparkles, Workflow, Zap } from "lucide-react";

export default function CommandCenter() {
  return (
    <section className="relative overflow-hidden rounded-[26px] border border-violet-400/15 bg-[linear-gradient(120deg,rgba(80,40,150,.32),rgba(13,13,22,.92)_45%,rgba(8,20,28,.9))] p-5 shadow-[0_24px_80px_rgba(0,0,0,.24)] sm:p-6 lg:p-7">
      <div className="pointer-events-none absolute -left-24 -top-28 size-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-0 size-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative grid gap-6 xl:grid-cols-[1.4fr_.8fr] xl:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-violet-200">
            <Sparkles className="size-4" /> Daily command center
          </div>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
            Your highest-impact work is already queued.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
            Nexora found three opportunities to save time today: automate lead follow-up, review one failed run, and summarize the launch project.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/dashboard/copilot"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Ask Nexora AI <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/dashboard/workflows"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 text-sm font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            >
              Review workflows
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {[
            { icon: Zap, label: "Automations today", value: "23", tone: "text-amber-200 bg-amber-400/10" },
            { icon: Workflow, label: "Needs review", value: "1", tone: "text-violet-200 bg-violet-400/10" },
            { icon: CheckCircle2, label: "Success rate", value: "98.6%", tone: "text-emerald-200 bg-emerald-400/10" },
          ].map(({ icon: Icon, label, value, tone }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 p-3.5 backdrop-blur-sm">
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}>
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-lg font-semibold leading-none">{value}</p>
                <p className="mt-1.5 truncate text-xs text-white/35">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
