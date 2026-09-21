import { Bot, BrainCircuit, Check, ChevronRight, CircleUserRound, FileText, Search, Sparkles, Workflow } from "lucide-react";

export default function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a11]/90 shadow-[0_30px_90px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.04]">
      <div className="flex h-11 items-center justify-between border-b border-white/10 px-4 sm:px-5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <div className="hidden rounded-md border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] text-white/35 sm:block">
          app.nexora.ai/workspace
        </div>
        <div className="size-5 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500" />
      </div>

      <div className="grid min-h-[420px] grid-cols-1 md:grid-cols-[190px_1fr] lg:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-white/10 bg-black/20 p-4 md:block">
          <div className="mb-5 flex items-center gap-2 px-2 text-sm font-medium text-white/80">
            <span className="grid size-7 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
              <Sparkles className="size-3.5" />
            </span>
            Nexora HQ
          </div>
          <div className="space-y-1 text-xs text-white/45">
            {["Ask Nexora", "Automations", "Knowledge", "Analytics"].map((item, index) => (
              <div
                key={item}
                className={index === 0 ? "flex items-center gap-2 rounded-lg bg-white/[0.07] px-3 py-2.5 text-white" : "flex items-center gap-2 rounded-lg px-3 py-2.5"}
              >
                {index === 0 ? <Bot className="size-3.5" /> : index === 1 ? <Workflow className="size-3.5" /> : index === 2 ? <FileText className="size-3.5" /> : <BrainCircuit className="size-3.5" />}
                {item}
              </div>
            ))}
          </div>
        </aside>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-violet-300/70">AI workspace</p>
              <h2 className="mt-2 text-lg font-semibold text-white sm:text-xl">Good morning, Alex.</h2>
              <p className="mt-1 text-xs text-white/40 sm:text-sm">Here is what needs your attention today.</p>
            </div>
            <CircleUserRound className="size-7 text-white/30" />
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {[
              ["12", "Open tasks", "+3 today"],
              ["8.4h", "Time saved", "this week"],
              ["96%", "Agent success", "+4.2%"],
            ].map(([value, label, note]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <div className="text-xl font-semibold text-white">{value}</div>
                <div className="mt-1 text-xs text-white/45">{label}</div>
                <div className="mt-3 text-[10px] text-emerald-300/70">{note}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-white/75">
                  <BrainCircuit className="size-4 text-violet-300" />
                  Ask your workspace
                </div>
                <Search className="size-3.5 text-white/25" />
              </div>
              <div className="mt-4 rounded-lg border border-violet-400/15 bg-violet-500/[0.06] p-3 text-xs leading-5 text-white/55">
                “Summarize customer feedback from this week and draft the three highest-impact product actions.”
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-white/30">
                <span>Searching 2,481 workspace items…</span>
                <span className="inline-flex items-center gap-1 text-violet-300/70">Run <ChevronRight className="size-3" /></span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-white/75">
                <Workflow className="size-4 text-cyan-300" />
                Live automations
              </div>
              <div className="mt-4 space-y-2.5">
                {["Qualify new leads", "Weekly customer digest", "Route support requests"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2.5 text-[11px] text-white/55">
                    <span>{item}</span>
                    <span className="grid size-5 place-items-center rounded-full bg-emerald-400/10 text-emerald-300"><Check className="size-3" /></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
