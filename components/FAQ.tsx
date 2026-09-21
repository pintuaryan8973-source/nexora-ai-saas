import { Plus } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const faqs = [
  ["What can I automate with Nexora?", "You can automate recurring knowledge work such as triage, summaries, research, lead qualification, internal reporting, content drafts, routing, and structured updates across connected tools."],
  ["Does Nexora train on my company data?", "Your workspace content is used to deliver the product experience you configure. For a real production deployment, pair this UI with your chosen backend and model provider's enterprise data controls and document them in your privacy policy."],
  ["Can different teams use different knowledge sources?", "Yes. The product is designed around scoped workspaces, sources, and agent instructions so each team can operate with the context relevant to its responsibilities."],
  ["Do I need to know how to code?", "No for standard workflows. Technical teams can still extend the product with APIs, webhooks, and custom integrations when you add the application backend."],
  ["Is this landing page connected to a real SaaS backend?", "Not yet. This project is the complete production-quality marketing frontend. Authentication, billing, database, and AI execution should be connected as separate application services."],
];

export default function FAQ() {
  return (
    <section id="faq" className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="FAQ"
          title="A few things teams ask before getting started."
          description="Clear answers about what this landing-page project includes and how the product concept is intended to scale."
        />

        <div className="mt-10 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-medium text-white/80 marker:content-none sm:text-base">
                {question}
                <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.035] text-white/40 transition group-open:rotate-45 group-open:text-violet-300">
                  <Plus className="size-3.5" />
                </span>
              </summary>
              <p className="max-w-3xl pt-3 pr-10 text-sm leading-6 text-white/45">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
