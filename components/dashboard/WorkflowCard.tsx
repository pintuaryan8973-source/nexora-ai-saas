import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, MoreHorizontal, Play, TriangleAlert } from "lucide-react";

const workflows = [
  { name: "Weekly client summary", trigger: "Every Friday at 5:00 PM", runs: "14 runs", status: "Active", success: "100%" },
  { name: "Lead qualification", trigger: "When a new lead arrives", runs: "38 runs", status: "Active", success: "97%" },
  { name: "Meeting follow-up", trigger: "After calendar meeting", runs: "9 runs", status: "Needs review", success: "89%" },
];

export default function WorkflowCard() {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c13]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <div>
          <h2 className="font-semibold">Recent workflows</h2>
          <p className="mt-1 text-xs text-white/35">Live automation performance.</p>
        </div>
        <Link href="/dashboard/workflows" className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-violet-200">
          View all <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="divide-y divide-white/[0.06]">
        {workflows.map((workflow) => {
          const needsReview = workflow.status === "Needs review";
          return (
            <div key={workflow.name} className="grid gap-4 px-5 py-4 transition hover:bg-white/[0.015] sm:grid-cols-[1.5fr_1fr_auto] sm:items-center">
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${needsReview ? "bg-amber-400/10 text-amber-300" : "bg-violet-500/10 text-violet-300"}`}>
                  {needsReview ? <TriangleAlert className="size-4" /> : <Play className="size-4 fill-current" />}
                </span>
                <div>
                  <p className="text-sm font-medium">{workflow.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-white/30">
                    <Clock3 className="size-3" /> {workflow.trigger}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-white/35 sm:justify-end">
                <span>{workflow.runs}</span>
                <span className={needsReview ? "flex items-center gap-1 text-amber-300/80" : "flex items-center gap-1 text-emerald-300/80"}>
                  <CheckCircle2 className="size-3" /> {workflow.success}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <span className={needsReview ? "w-fit rounded-full bg-amber-400/10 px-2.5 py-1 text-xs text-amber-300" : "w-fit rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300"}>
                  {workflow.status}
                </span>
                <button type="button" aria-label={`More actions for ${workflow.name}`} className="grid size-8 place-items-center rounded-lg text-white/25 hover:bg-white/[0.05] hover:text-white">
                  <MoreHorizontal className="size-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
