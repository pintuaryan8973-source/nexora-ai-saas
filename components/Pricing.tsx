"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";

const plans = [
  {
    name: "Starter",
    monthly: 0,
    description: "For individuals exploring AI-powered workflows.",
    cta: "Start free",
    features: ["1 workspace", "3 AI agents", "100 automation runs", "Core integrations", "Community support"],
  },
  {
    name: "Pro",
    monthly: 29,
    description: "For teams turning repeatable work into scalable systems.",
    cta: "Start 14-day trial",
    popular: true,
    features: ["Unlimited agents", "5,000 automation runs", "Advanced integrations", "Analytics and evaluation", "Priority support"],
  },
  {
    name: "Business",
    monthly: 79,
    description: "For growing organizations that need more control.",
    cta: "Contact sales",
    features: ["Everything in Pro", "25,000 automation runs", "Role-based access", "Custom data retention", "Dedicated success manager"],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Simple pricing"
          title="Start small. Scale when Nexora earns it."
          description="Every plan includes the core AI workspace. Upgrade when you need more automation, integrations, and governance."
        />

        <div className="mt-7 flex justify-center">
          <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.04] p-1 text-xs">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-lg px-3 py-2 transition ${!annual ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"}`}
              aria-pressed={!annual}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`rounded-lg px-3 py-2 transition ${annual ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"}`}
              aria-pressed={annual}
            >
              Annual <span className="ml-1 text-emerald-300">save 20%</span>
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = plan.monthly === 0 ? 0 : annual ? Math.round(plan.monthly * 0.8) : plan.monthly;

            return (
              <article
                key={plan.name}
                className={`relative rounded-2xl border p-6 ${plan.popular ? "border-violet-400/35 bg-violet-500/[0.06] shadow-[0_20px_60px_rgba(76,29,149,0.18)]" : "border-white/[0.08] bg-white/[0.025]"}`}
              >
                {plan.popular ? (
                  <div className="absolute -top-3 left-6 rounded-full border border-violet-400/20 bg-[#171022] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-300">
                    Most popular
                  </div>
                ) : null}

                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-white/45">{plan.description}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-white">${price}</span>
                  <span className="pb-1 text-xs text-white/35">/user/mo</span>
                </div>
                <p className="mt-2 text-[11px] text-white/30">{annual && plan.monthly > 0 ? "Billed annually" : plan.monthly === 0 ? "Free forever" : "Billed monthly"}</p>

                <Button href="/signup" variant={plan.popular ? "primary" : "secondary"} className="mt-6 w-full">
                  {plan.cta}
                </Button>

                <ul className="mt-6 space-y-3 border-t border-white/[0.07] pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 text-sm text-white/50">
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-300/80" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
