import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Pause, Play, Workflow as WorkflowIcon } from "lucide-react";
import { statusLabel, triggerLabel, type WorkflowRecord } from "@/lib/workflows";

export default function WorkflowCard({ workflows }: { workflows: WorkflowRecord[] }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c13]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <div>
          <h2 className="font-semibold">Recent workflows</h2>
          <p className="mt-1 text-xs text-white/35">Saved securely in your Supabase workspace.</p>
        </div>
        <Link href="/dashboard/workflows" className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-violet-200">
          View all <ArrowRight className="size-3" />
        </Link>
      </div>

      {workflows.length > 0 ? (
        <div className="divide-y divide-white/[0.06]">
          {workflows.map((workflow) => {
            const active = workflow.status === "active";
            return (
              <div key={workflow.id} className="grid gap-4 px-5 py-4 transition hover:bg-white/[0.015] sm:grid-cols-[1.5fr_1fr_auto] sm:items-center">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${active ? "bg-violet-500/10 text-violet-300" : "bg-amber-400/10 text-amber-300"}`}>
                    {active ? <Play className="size-4 fill-current" /> : <Pause className="size-4" />}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{workflow.name}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-white/30">
                      <Clock3 className="size-3" /> {triggerLabel(workflow.trigger_type)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-white/35 sm:justify-end">
                  <span>{workflow.run_count} runs</span>
                  <span className="flex items-center gap-1 text-emerald-300/80">
                    <CheckCircle2 className="size-3" /> Saved
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 sm:justify-end">
                  <span className={`w-fit rounded-full px-2.5 py-1 text-xs ${active ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300"}`}>
                    {statusLabel(workflow.status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid min-h-48 place-items-center p-8 text-center">
          <div>
            <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-violet-500/10 text-violet-300">
              <WorkflowIcon className="size-5" />
            </span>
            <p className="mt-4 text-sm font-medium">No workflows yet</p>
            <p className="mt-1 text-xs text-white/30">Create one and it will appear here automatically.</p>
            <Link href="/dashboard/workflows?new=1" className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-violet-300">
              Create workflow <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
