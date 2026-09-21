import { Bot, Check, Plug, UserPlus, Workflow } from "lucide-react";

const items = [
  { icon: Workflow, title: "Lead qualification completed", detail: "38 leads processed", time: "6 min ago", tone: "text-violet-300 bg-violet-500/10" },
  { icon: Bot, title: "Copilot generated a project summary", detail: "Nexora launch", time: "24 min ago", tone: "text-cyan-300 bg-cyan-500/10" },
  { icon: Plug, title: "Google Drive synced", detail: "12 files updated", time: "Yesterday", tone: "text-emerald-300 bg-emerald-500/10" },
  { icon: UserPlus, title: "Workspace invitation created", detail: "1 pending invite", time: "2 days ago", tone: "text-fuchsia-300 bg-fuchsia-500/10" },
];

export default function ActivityFeed() {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0c0c13] p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Recent activity</h2>
          <p className="mt-1 text-xs text-white/35">Latest updates across your workspace.</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-300">
          <Check className="size-3" /> Live
        </span>
      </div>

      <div className="mt-5 space-y-1">
        {items.map(({ icon: Icon, title, detail, time, tone }) => (
          <div key={title} className="flex gap-3 rounded-xl px-2 py-3 transition hover:bg-white/[0.025]">
            <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="size-4" /></span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white/75">{title}</p>
              <p className="mt-1 text-xs text-white/30">{detail}</p>
            </div>
            <span className="shrink-0 pt-0.5 text-[10px] text-white/20">{time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
