import { CalendarClock, Mail, MessageSquareText, Zap } from "lucide-react";
import ModulePage from "@/components/dashboard/ModulePage";

const automations = [
  { icon: Mail, title: "Inbox triage", text: "Classify new messages and route important ones.", runs: "184 runs", status: "Running" },
  { icon: CalendarClock, title: "Meeting brief", text: "Prepare context before important calendar events.", runs: "62 runs", status: "Running" },
  { icon: MessageSquareText, title: "Follow-up drafts", text: "Create personalized follow-up drafts after meetings.", runs: "39 runs", status: "Draft" },
];

export default function AutomationsPage() {
  return (
    <ModulePage eyebrow="Hands-free work" title="Automations" description="Let Nexora handle repetitive actions while you stay in control." icon={Zap}>
      <div className="grid gap-4 lg:grid-cols-3">
        {automations.map(({ icon: Icon, title, text, runs, status }) => (
          <article key={title} className="rounded-2xl border border-white/[0.08] bg-[#0c0c13] p-5">
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-xl bg-fuchsia-500/10 text-fuchsia-300"><Icon className="size-4" /></span>
              <span className={status === "Running" ? "text-xs text-emerald-300" : "text-xs text-white/30"}>{status}</span>
            </div>
            <h2 className="mt-5 font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/35">{text}</p>
            <p className="mt-5 text-xs text-white/25">{runs}</p>
          </article>
        ))}
      </div>
    </ModulePage>
  );
}
