"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import Button from "@/components/Button";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Customers", href: "#customers" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-black/45 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-5"
      >
        <Link
          href="#top"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="grid size-9 place-items-center rounded-xl border border-violet-400/25 bg-violet-500/15 text-violet-300 shadow-lg shadow-violet-950/40 transition group-hover:scale-105">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold tracking-tight text-white">
            Nexora <span className="text-violet-300">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-white/65 transition hover:bg-white/[0.05] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Button href="/login" variant="ghost" size="sm">
            Sign in
          </Button>
          <Button href="/signup" size="sm">
            Start free
          </Button>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white sm:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open ? (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/10 bg-[#0a0a12]/95 p-3 shadow-2xl backdrop-blur-xl sm:hidden">
          <div className="grid gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/[0.06] hover:text-white"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
            <Button href="/login" variant="secondary" size="sm" onClick={() => setOpen(false)}>
              Sign in
            </Button>
            <Button href="/signup" size="sm" onClick={() => setOpen(false)}>
              Start free
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
