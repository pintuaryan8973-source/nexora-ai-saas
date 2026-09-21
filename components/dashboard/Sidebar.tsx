"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  Crown,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Plug,
  Settings,
  Sparkles,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { DashboardUser } from "@/components/DashboardShell";

const primary = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Copilot", href: "/dashboard/copilot", icon: Bot, badge: "AI" },
  { label: "Workflows", href: "/dashboard/workflows", icon: Workflow, badge: "12" },
  { label: "Automations", href: "/dashboard/automations", icon: Zap },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
];

const workspace = [
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Integrations", href: "/dashboard/integrations", icon: Plug, badge: "4" },
  { label: "Team", href: "/dashboard/team", icon: Users },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Sidebar({
  user,
  mobileOpen,
  onClose,
  onSignOut,
  signingOut,
}: {
  user: DashboardUser;
  mobileOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  signingOut: boolean;
}) {
  const pathname = usePathname();

  const renderLinks = (items: typeof primary) =>
    items.map(({ label, href, icon: Icon, badge }) => {
      const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);

      return (
        <Link
          key={href}
          href={href}
          onClick={onClose}
          className={cn(
            "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
            active
              ? "bg-violet-500/15 text-white ring-1 ring-inset ring-violet-400/15"
              : "text-white/50 hover:bg-white/[0.05] hover:text-white/85",
          )}
        >
          <Icon className={cn("size-[18px]", active ? "text-violet-300" : "text-white/35 group-hover:text-white/70")} />
          <span>{label}</span>
          {badge && (
            <span className={cn("ml-auto rounded-md px-1.5 py-0.5 text-[10px]", active ? "bg-violet-300/10 text-violet-200" : "bg-white/[0.04] text-white/25")}>{badge}</span>
          )}
          {!badge && active && <span className="ml-auto size-1.5 rounded-full bg-violet-400" />}
        </Link>
      );
    });

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-white/[0.08] bg-[#09090f]/95 p-4 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-12 items-center justify-between px-2">
          <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl border border-violet-400/25 bg-violet-500/15 text-violet-300 shadow-lg shadow-violet-950/30">
              <Sparkles className="size-4" />
            </span>
            <span className="font-semibold tracking-tight">
              Nexora <span className="text-violet-300">AI</span>
            </span>
          </Link>

          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg text-white/50 hover:bg-white/[0.06] hover:text-white lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.045] to-violet-500/[0.035] p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300/70">Workspace</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-xs font-semibold shadow-lg shadow-violet-950/30">
                  NX
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">Nexora HQ</p>
                  <p className="truncate text-xs text-white/35">Free workspace</p>
                </div>
              </div>
            </div>
            <span className="rounded-lg bg-emerald-400/10 px-2 py-1 text-[9px] font-medium text-emerald-300">Live</span>
          </div>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto pr-1">
          <div className="space-y-1">{renderLinks(primary)}</div>

          <p className="mb-2 mt-7 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/25">Workspace</p>
          <div className="space-y-1">{renderLinks(workspace)}</div>

          <p className="mb-2 mt-7 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/25">Account</p>
          <Link
            href="/dashboard/settings"
            onClick={onClose}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
              pathname.startsWith("/dashboard/settings")
                ? "bg-violet-500/15 text-white ring-1 ring-inset ring-violet-400/15"
                : "text-white/50 hover:bg-white/[0.05] hover:text-white/85",
            )}
          >
            <Settings className="size-[18px] text-white/35 group-hover:text-white/70" />
            Settings
          </Link>
        </nav>

        <div className="rounded-2xl border border-violet-400/15 bg-violet-500/[0.06] p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-violet-200"><Crown className="size-3.5" /> Pro trial</div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400" /></div>
          <div className="mt-2 flex justify-between text-[10px] text-white/30"><span>10 days left</span><span>72%</span></div>
        </div>

        <div className="mt-3 border-t border-white/[0.08] pt-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.08] text-xs font-semibold text-violet-200">
              {initials(user.name) || "U"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-white/35">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            disabled={signingOut}
            onClick={onSignOut}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45 transition hover:bg-rose-500/10 hover:text-rose-200 disabled:opacity-50"
          >
            <LogOut className="size-[18px]" />
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </aside>
    </>
  );
}
