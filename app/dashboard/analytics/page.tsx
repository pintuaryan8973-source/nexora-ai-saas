import { BarChart3, Bot, CheckCircle2, Clock3 } from "lucide-react";
import ModulePage from "@/components/dashboard/ModulePage";
import UsageOverview from "@/components/dashboard/UsageOverview";

export default function AnalyticsPage() {
  return (
    <ModulePage eyebrow="Workspace intelligence" title="Analytics" description="Understand AI usage, automation reliability, and time saved across your workspace." icon={BarChart3}>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Bot, value: "1,248", label: "AI requests" },
          { icon: CheckCircle2, value: "98.6%", label: "Automation success" },
          { icon: Clock3, value: "31.4h", label: "Estimated time saved" },
        ].map(({ icon: Icon, value, label }) => (
          <article key={label} className="rounded-2xl border border-white/[0.08] bg-[#0c0c13] p-5"><Icon className="size-5 text-violet-300" /><p className="mt-5 text-3xl font-semibold">{value}</p><p className="mt-1 text-sm text-white/35">{label}</p></article>
        ))}
      </div>
      <div className="mt-5"><UsageOverview /></div>
    </ModulePage>
  );
}
