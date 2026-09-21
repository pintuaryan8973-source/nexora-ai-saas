import { Bot, BrainCircuit, FileSearch, Workflow } from "lucide-react";
import AICopilot from "@/components/dashboard/AICopilot";
import ModulePage from "@/components/dashboard/ModulePage";

export default function CopilotPage() {
  return (
    <ModulePage eyebrow="Intelligence" title="AI Copilot" description="Ask questions, plan work, and turn ideas into repeatable actions from one workspace." icon={Bot}>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_.7fr]">
        <AICopilot compact={false} />
        <div className="space-y-3">
          {[
            { icon: BrainCircuit, title: "Reason across work", text: "Combine context from projects, workflows, and connected tools." },
            { icon: FileSearch, title: "Find answers faster", text: "Use one prompt to surface the right information from your workspace." },
            { icon: Workflow, title: "Turn prompts into actions", text: "Convert useful answers into workflows and automations." },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-white/[0.08] bg-[#0c0c13] p-5">
              <Icon className="size-5 text-violet-300" />
              <h2 className="mt-4 text-sm font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/35">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </ModulePage>
  );
}
