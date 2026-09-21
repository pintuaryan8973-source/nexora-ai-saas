import { BrainCircuit, DatabaseZap, Gauge, LockKeyhole, MessagesSquare, Workflow } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const features = [
  {
    icon: BrainCircuit,
    title: "AI that understands your context",
    description: "Connect docs, tickets, CRM notes, and project data so answers are grounded in the way your company actually works.",
  },
  {
    icon: Workflow,
    title: "Automations without busywork",
    description: "Build dependable multi-step workflows that classify, summarize, route, write, and update tools automatically.",
  },
  {
    icon: MessagesSquare,
    title: "One copilot for every team",
    description: "Give support, sales, product, and operations a shared AI layer while keeping each workflow focused and relevant.",
  },
  {
    icon: DatabaseZap,
    title: "Knowledge that stays current",
    description: "Continuously sync trusted sources and turn fragmented company information into a searchable operating system.",
  },
  {
    icon: Gauge,
    title: "Built for measurable outcomes",
    description: "Track completion rate, response quality, saved time, and automation health from one clear analytics view.",
  },
  {
    icon: LockKeyhole,
    title: "Control without slowing down",
    description: "Use granular access rules, audit-friendly workflows, and secure data boundaries for teams that take trust seriously.",
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Everything connected"
          title="Less tool switching. More high-value work."
          description="Nexora gives your team the intelligence and automation layer to move from information overload to clear, repeatable execution."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.05]"
            >
              <div className="absolute -right-12 -top-12 size-32 rounded-full bg-violet-500/0 blur-3xl transition group-hover:bg-violet-500/10" />
              <div className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-violet-300 shadow-lg shadow-black/10">
                <Icon className="size-[18px]" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/45">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
