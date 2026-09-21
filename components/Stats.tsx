const stats = [
  { value: "41%", label: "less time spent on repetitive work" },
  { value: "3.2×", label: "faster turnaround on recurring workflows" },
  { value: "92%", label: "of users find answers without escalation" },
  { value: "8.7h", label: "average time saved per user each week" },
];

export default function Stats() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#090910] p-7 text-center">
            <div className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{stat.value}</div>
            <div className="mx-auto mt-2 max-w-44 text-xs leading-5 text-white/40">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
