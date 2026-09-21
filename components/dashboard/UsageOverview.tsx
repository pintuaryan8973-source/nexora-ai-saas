const bars = [36, 52, 44, 68, 58, 78, 64, 86, 72, 91, 76, 82, 88, 93];

export default function UsageOverview() {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0c0c13] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Usage overview</h2>
            <span className="rounded-full bg-violet-400/10 px-2 py-0.5 text-[10px] font-medium text-violet-300">AI</span>
          </div>
          <p className="mt-1 text-xs text-white/35">AI activity across the last 14 days.</p>
        </div>
        <div className="flex items-center gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">Requests</p>
            <p className="mt-1 text-xl font-semibold">1,248</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">Time saved</p>
            <p className="mt-1 text-xl font-semibold">31.4h</p>
          </div>
          <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">+18.4%</span>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-[auto_1fr] gap-3">
        <div className="flex h-48 flex-col justify-between py-0.5 text-[10px] text-white/20">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>
        <div className="relative flex h-48 items-end gap-1.5 border-b border-l border-white/[0.05] pl-2">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:100%_25%]" />
          {bars.map((height, index) => (
            <div key={index} className="relative z-10 flex h-full flex-1 items-end">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-violet-600/25 via-violet-400/55 to-cyan-300/75 transition duration-200 hover:brightness-125"
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-between pl-8 text-[10px] text-white/20">
        <span>8 Sep</span>
        <span>14 Sep</span>
        <span>Today</span>
      </div>
    </section>
  );
}
