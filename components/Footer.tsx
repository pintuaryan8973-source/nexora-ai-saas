import Link from "next/link";
import { Sparkles } from "lucide-react";

const groups = [
  { title: "Product", links: [["Features", "#features"], ["Pricing", "#pricing"], ["Customers", "#customers"], ["FAQ", "#faq"]] },
  { title: "Company", links: [["About", "#top"], ["Careers", "#cta"], ["Contact", "mailto:hello@nexora.example"], ["Changelog", "#top"]] },
  { title: "Resources", links: [["Documentation", "#faq"], ["API", "#faq"], ["Security", "#faq"], ["Status", "#top"]] },
];

export default function Footer() {
  return (
    <footer className="px-4 pb-8 pt-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl border-t border-white/[0.08] pt-10">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Link href="#top" className="inline-flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                <Sparkles className="size-4" />
              </span>
              <span className="font-semibold tracking-tight text-white">Nexora AI</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/40">
              The intelligent workspace for teams that want less repetitive work and more forward motion.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-sm text-white/35 transition hover:text-white/70">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.07] pt-6 text-xs text-white/28 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Nexora AI. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#top" className="hover:text-white/55">Privacy</Link>
            <Link href="#top" className="hover:text-white/55">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
