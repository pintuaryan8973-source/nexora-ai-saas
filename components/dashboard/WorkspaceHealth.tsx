import { CheckCircle2, Cpu, Database, ShieldCheck, Zap } from "lucide-react";

const metrics = [
  { label: "Automation reliability", value: "98.6%", percent: 98, icon: Zap },
  { label: "AI usage capacity", value: "62%", percent: 62, icon: Cpu },
  { label: "Workspace data sync", value: "Healthy", percent: 92, icon: Database },
];

export default function WorkspaceHealth() {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0c0c13] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold">Workspace health</h2>
          <p className="mt-1 text-xs text-white/35">Reliability, capacity, and connected data status.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
          <ShieldCheck className="size-3" /> Healthy
        </span>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {metrics.map(({ label, value, percent, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-violet-500/10 text-violet-300"><Icon className="size-4" /></span>
              <CheckCircle2 className="size-4 text-emerald-300/70" />
            </div>
            <p className="mt-4 text-sm text-white/40">{label}</p>
            <p className="mt-1 text-xl font-semibold">{value}</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-300" style={{ width: `${percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
