import { ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/Button";

export default function CTA() {
  return (
    <section id="cta" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-cyan-500/10 px-6 py-14 text-center shadow-[0_30px_100px_rgba(76,29,149,0.18)] sm:px-10 lg:py-20">
        <div className="absolute left-1/2 top-[-14rem] size-[28rem] -translate-x-1/2 rounded-full bg-violet-500/20 blur-[100px]" />
        <div className="relative">
          <div className="mx-auto grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.07] text-violet-200">
            <Sparkles className="size-5" />
          </div>
          <h2 className="mx-auto mt-5 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
            Give your team back the time that busywork keeps taking.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/50 sm:text-base">
            Start with one workflow today. Keep the ones that create real leverage.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/signup" size="lg" iconRight={<ArrowRight className="size-4" />}>
              Start free
            </Button>
            <Button href="mailto:hello@nexora.example" variant="secondary" size="lg">
              Talk to sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
