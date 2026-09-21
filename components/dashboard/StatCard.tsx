import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  change,
  icon: Icon,
  detail,
  trend = [42, 56, 48, 67, 63, 78, 84],
}: {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  detail: string;
  trend?: number[];
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c13] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-violet-400/20 hover:bg-[#0f0f18]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white/40">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-xl border border-violet-400/10 bg-violet-500/10 text-violet-300 transition group-hover:bg-violet-500/15">
          <Icon className="size-[18px]" />
        </span>
      </div>

      <div className="mt-4 flex h-10 items-end gap-1">
        {trend.map((height, index) => (
          <span
            key={`${label}-${index}`}
            className="flex-1 rounded-sm bg-gradient-to-t from-violet-500/25 to-violet-300/70"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        <span className="rounded-full bg-emerald-400/10 px-2 py-1 font-medium text-emerald-300">{change}</span>
        <span className="text-white/25">{detail}</span>
      </div>
    </article>
  );
}
