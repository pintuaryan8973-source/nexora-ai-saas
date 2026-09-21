import { ArrowDownToLine, Bot, WandSparkles } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const steps = [
  {
    number: "01",
    icon: ArrowDownToLine,
    title: "Connect your knowledge",
    description: "Bring in the tools and sources your team already uses. Nexora organizes them into a permission-aware knowledge layer.",
  },
  {
    number: "02",
    icon: Bot,
    title: "Create your AI agents",
    description: "Describe the outcome, choose the sources and guardrails, then let Nexora turn the workflow into a reusable agent.",
  },
  {
    number: "03",
    icon: WandSparkles,
    title: "Automate and improve",
    description: "Deploy to real work, review outcomes, and use analytics to continuously improve speed, quality, and consistency.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.045] to-white/[0.02] p-6 sm:p-8 lg:p-12">
        <SectionHeading
          eyebrow="Simple by design"
          title="From first connection to real automation in minutes."
          description="No maze of configuration. Start with your existing work, add intelligence, then scale what proves useful."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {steps.map(({ number, icon: Icon, title, description }) => (
            <article key={number} className="relative rounded-2xl border border-white/[0.08] bg-black/20 p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.16em] text-white/25">{number}</span>
                <span className="grid size-9 place-items-center rounded-xl bg-violet-500/10 text-violet-300">
                  <Icon className="size-4" />
                </span>
              </div>
              <h3 className="mt-8 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/45">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
