import { AlertTriangle, ArrowRight, Lightbulb, Sparkles } from "lucide-react";

const insights = [
  {
    icon: Lightbulb,
    title: "Automate lead follow-up",
    text: "You repeated the same follow-up pattern 8 times this week.",
    tone: "bg-amber-400/10 text-amber-200",
  },
  {
    icon: AlertTriangle,
    title: "One workflow needs review",
    text: "Meeting follow-up has not run successfully since yesterday.",
    tone: "bg-rose-400/10 text-rose-200",
  },
];

export default function SmartInsights() {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0c0c13] p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-violet-300" />
            <h2 className="font-semibold">Smart insights</h2>
          </div>
          <p className="mt-1 text-xs text-white/35">AI-generated opportunities from your workspace.</p>
        </div>
        <span className="rounded-full bg-violet-400/10 px-2 py-1 text-[10px] font-medium text-violet-300">3 new</span>
      </div>

      <div className="mt-4 space-y-3">
        {insights.map(({ icon: Icon, title, text, tone }) => (
          <button key={title} type="button" className="group flex w-full items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-left transition hover:bg-white/[0.04]">
            <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${tone}`}>
              <Icon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{title}</span>
              <span className="mt-1 block text-xs leading-5 text-white/35">{text}</span>
            </span>
            <ArrowRight className="mt-1 size-4 shrink-0 text-white/20 transition group-hover:translate-x-0.5 group-hover:text-violet-300" />
          </button>
        ))}
      </div>
    </section>
  );
}
