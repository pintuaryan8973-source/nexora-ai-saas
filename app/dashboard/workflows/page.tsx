import { ArrowRight, Clock3, Plus, Workflow } from "lucide-react";
import ModulePage from "@/components/dashboard/ModulePage";

const workflows = [
  { name: "Lead qualification", trigger: "New form response", steps: 5, status: "Active", lastRun: "8 minutes ago" },
  { name: "Weekly client summary", trigger: "Every Friday, 5 PM", steps: 4, status: "Active", lastRun: "2 days ago" },
  { name: "Meeting follow-up", trigger: "Calendar event ended", steps: 3, status: "Paused", lastRun: "5 days ago" },
];

export default function WorkflowsPage() {
  return (
    <ModulePage eyebrow="Automation builder" title="Workflows" description="Design repeatable processes that connect your tools, data, and AI." icon={Workflow}>
      <div className="flex justify-end">
        <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black hover:bg-white/90"><Plus className="size-4" /> Create workflow</button>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {workflows.map((item) => (
          <article key={item.name} className="rounded-2xl border border-white/[0.08] bg-[#0c0c13] p-5">
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-xl bg-violet-500/10 text-violet-300"><Workflow className="size-4" /></span>
              <span className={item.status === "Active" ? "rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300" : "rounded-full bg-amber-400/10 px-2.5 py-1 text-xs text-amber-300"}>{item.status}</span>
            </div>
            <h2 className="mt-5 font-semibold">{item.name}</h2>
            <p className="mt-2 text-sm text-white/35">{item.trigger}</p>
            <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4 text-xs text-white/30">
              <span>{item.steps} steps</span>
              <span className="flex items-center gap-1"><Clock3 className="size-3" /> {item.lastRun}</span>
            </div>
            <button className="mt-4 flex items-center gap-1 text-xs font-medium text-violet-300">Open workflow <ArrowRight className="size-3" /></button>
          </article>
        ))}
      </div>
    </ModulePage>
  );
}
