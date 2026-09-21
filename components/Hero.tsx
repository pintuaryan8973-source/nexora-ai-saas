import { ArrowRight, CheckCircle2, Play } from "lucide-react";
import Button from "@/components/Button";
import ProductPreview from "@/components/ProductPreview";

const trustPoints = ["No credit card", "14-day Pro trial", "Cancel anytime"];

export default function Hero() {
  return (
    <section id="top" className="relative px-4 pb-16 pt-36 sm:px-6 sm:pt-44 lg:px-8 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.08] px-3 py-1.5 text-xs font-medium text-violet-200 shadow-lg shadow-violet-950/20">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Nexora 2.0 is live — faster workflows, smarter agents
          </div>

          <h1 className="animate-rise mt-7 text-balance text-5xl font-semibold tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl xl:text-[5.5rem] xl:leading-[0.98]">
            Turn scattered work into
            <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              intelligent momentum.
            </span>
          </h1>

          <p className="animate-rise-delay mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
            Nexora AI connects your knowledge, automates repetitive work, and gives every team an AI copilot that understands what matters.
          </p>

          <div className="animate-rise-delay-2 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/signup" size="lg" iconRight={<ArrowRight className="size-4" />}>
              Start building free
            </Button>
            <Button href="#demo" variant="secondary" size="lg" iconLeft={<Play className="size-4 fill-current" />}>
              Watch 90-sec demo
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/45 sm:text-sm">
            {trustPoints.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400/80" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div id="demo" className="relative mx-auto mt-14 max-w-6xl sm:mt-16">
          <div className="absolute -inset-8 -z-10 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.18),transparent_62%)] blur-2xl" />
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
