"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Menu, Plus, Search, Sparkles, X } from "lucide-react";
import type { DashboardUser } from "@/components/DashboardShell";

const titles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/copilot": "AI Copilot",
  "/dashboard/workflows": "Workflows",
  "/dashboard/automations": "Automations",
  "/dashboard/projects": "Projects",
  "/dashboard/analytics": "Analytics",
  "/dashboard/integrations": "Integrations",
  "/dashboard/team": "Team",
  "/dashboard/settings": "Settings",
};

export default function Topbar({ user, onMenu }: { user: DashboardUser; onMenu: () => void }) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Nexora AI";
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#06060b]/82 backdrop-blur-2xl">
      <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation"
          className="grid size-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/65 lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold sm:text-base">{title}</p>
          <p className="hidden text-xs text-white/30 sm:block">Nexora HQ / {user.name}</p>
        </div>

        <div className="ml-auto hidden w-full max-w-md items-center md:flex">
          <label className="relative w-full">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/25" />
            <input
              type="search"
              aria-label="Search workspace"
              placeholder="Search workflows, projects, people..."
              className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-9 pr-14 text-sm text-white outline-none placeholder:text-white/25 focus:border-violet-400/30 focus:bg-white/[0.05]"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/25">⌘ K</kbd>
          </label>
        </div>

        <button
          type="button"
          aria-label="Search"
          onClick={() => setMobileSearch((value) => !value)}
          className="grid size-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-white/50 md:hidden"
        >
          {mobileSearch ? <X className="size-4" /> : <Search className="size-4" />}
        </button>

        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setNotificationsOpen((value) => !value)}
            className="relative grid size-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-white/50 transition hover:bg-white/[0.06] hover:text-white"
          >
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-violet-400" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 w-[320px] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0d0d15] shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
                <p className="text-sm font-semibold">Notifications</p>
                <span className="text-[10px] text-violet-300">3 new</span>
              </div>
              <div className="space-y-1 p-2">
                {[
                  "Lead qualification completed successfully",
                  "Meeting follow-up needs your review",
                  "Nexora generated a launch project summary",
                ].map((item, index) => (
                  <button key={item} type="button" className="flex w-full gap-3 rounded-xl p-3 text-left hover:bg-white/[0.04]">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-violet-500/10 text-violet-300"><Sparkles className="size-3.5" /></span>
                    <span className="min-w-0">
                      <span className="block text-xs leading-5 text-white/65">{item}</span>
                      <span className="mt-1 block text-[10px] text-white/25">{index === 0 ? "6 min ago" : index === 1 ? "24 min ago" : "1 hour ago"}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link
          href="/dashboard/workflows?new=1"
          className="hidden h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90 sm:inline-flex"
        >
          <Plus className="size-4" />
          New workflow
        </Link>

        <button type="button" className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs text-white/55 xl:flex">
          <span className="grid size-7 place-items-center rounded-lg bg-violet-500/15 font-semibold text-violet-200">{user.name.slice(0, 1).toUpperCase()}</span>
          <ChevronDown className="size-3" />
        </button>
      </div>

      {mobileSearch && (
        <div className="border-t border-white/[0.06] px-4 py-3 md:hidden">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/25" />
            <input
              autoFocus
              type="search"
              placeholder="Search workspace..."
              className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-9 pr-3 text-sm outline-none placeholder:text-white/25 focus:border-violet-400/30"
            />
          </label>
        </div>
      )}
    </header>
  );
}
