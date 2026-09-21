const logos = ["LUMA", "NORTHSTAR", "PULSE", "ARC", "MOSAIC", "ATLAS"];

export default function LogoCloud() {
  return (
    <section aria-label="Trusted companies" className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl border-y border-white/[0.07] py-8">
        <p className="text-center text-xs uppercase tracking-[0.18em] text-white/30">Trusted by product teams moving fast</p>
        <div className="mt-6 grid grid-cols-2 gap-6 text-center sm:grid-cols-3 lg:grid-cols-6">
          {logos.map((logo) => (
            <div key={logo} className="text-xs font-semibold tracking-[0.16em] text-white/28 transition hover:text-white/55">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
