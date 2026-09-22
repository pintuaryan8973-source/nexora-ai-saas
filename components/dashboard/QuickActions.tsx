import Link from "next/link";
import { ArrowUpRight, Bot, PlugZap, Plus, UserPlus } from "lucide-react";

const actions = [
  { label: "New workflow", text: "Automate a repeated task", href: "/dashboard/workflows?new=1", icon: Plus },
  { label: "Ask Nexora AI", text: "Start a copilot session", href: "/dashboard/copilot", icon: Bot },
  { label: "Connect app", text: "Add a new integration", href: "/dashboard/integrations", icon: PlugZap },
  { label: "Invite member", text: "Grow your workspace", href: "/dashboard/team", icon: UserPlus },
];

export default function QuickActions() {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0c0c13] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold">Quick actions</h2>
          <p className="mt-1 text-xs text-white/35">Jump straight into your most common tasks.</p>
        </div>
        <span className="hidden rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-[10px] text-white/25 sm:block">
          Command center
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map(({ label, text, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:-translate-y-0.5 hover:border-violet-400/20 hover:bg-violet-500/[0.06]"
          >
            <div className="flex items-start justify-between">
              <span className="grid size-10 place-items-center rounded-xl bg-white/[0.05] text-white/60 transition group-hover:bg-violet-500/15 group-hover:text-violet-200">
                <Icon className="size-4" />
              </span>
              <ArrowUpRight className="size-4 text-white/20 transition group-hover:text-violet-300" />
            </div>
            <p className="mt-4 text-sm font-medium">{label}</p>
            <p className="mt-1 text-xs leading-5 text-white/30">{text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
