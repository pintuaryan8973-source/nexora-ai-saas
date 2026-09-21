export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#05050a]">
      <div className="absolute left-1/2 top-[-18rem] size-[42rem] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[120px]" />
      <div className="absolute -left-40 top-[28rem] size-[28rem] rounded-full bg-fuchsia-700/10 blur-[110px]" />
      <div className="absolute -right-40 top-[46rem] size-[30rem] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_75%)]" />
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.12),transparent_70%)]" />
    </div>
  );
}
