import { Quote } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const testimonials = [
  {
    quote: "Nexora replaced three disconnected internal workflows. Our support team now gets the context it needs before the first reply is sent.",
    name: "Maya Chen",
    role: "VP Customer Experience, Northstar",
    initials: "MC",
  },
  {
    quote: "The biggest win is consistency. Our weekly research and reporting process went from half a day to something we can review in minutes.",
    name: "Jon Bell",
    role: "Head of Operations, Mosaic",
    initials: "JB",
  },
  {
    quote: "We finally have AI that works with our internal knowledge instead of around it. Adoption was fast because the product feels immediately useful.",
    name: "Priya Raman",
    role: "Product Director, Atlas",
    initials: "PR",
  },
];

export default function Testimonials() {
  return (
    <section id="customers" className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Customer momentum"
          title="Built for teams that care about quality and speed."
          description="Nexora helps modern teams make AI useful in day-to-day work—not just impressive in a demo."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {testimonials.map((item) => (
            <figure key={item.name} className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
              <Quote className="size-5 text-violet-300/80" aria-hidden="true" />
              <blockquote className="mt-5 flex-1 text-sm leading-6 text-white/60">“{item.quote}”</blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-white/[0.07] pt-5">
                <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-violet-500/35 to-fuchsia-500/25 text-xs font-semibold text-violet-100 ring-1 ring-white/10">
                  {item.initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-white/85">{item.name}</div>
                  <div className="mt-0.5 text-[11px] text-white/35">{item.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
