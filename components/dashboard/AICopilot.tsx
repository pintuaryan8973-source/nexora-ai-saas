"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowUp, Bot, FileText, Sparkles, WandSparkles } from "lucide-react";

const prompts = ["Summarize my work", "Build a follow-up workflow", "What needs attention?"];

export default function AICopilot({ compact = true }: { compact?: boolean }) {
  const [input, setInput] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    setLastPrompt(value);
    setInput("");
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-950/40 via-[#0d0b15] to-[#0c0c13] p-5">
      <div className="pointer-events-none absolute right-0 top-0 size-52 translate-x-1/3 -translate-y-1/3 rounded-full bg-violet-600/15 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl border border-violet-400/15 bg-violet-500/15 text-violet-200">
            <Bot className="size-[18px]" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Nexora Copilot</h2>
              <span className="rounded-full border border-violet-400/15 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-200">AI</span>
            </div>
            <p className="mt-0.5 text-xs text-white/35">Workspace-aware assistant</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-300">Online</span>
      </div>

      {lastPrompt ? (
        <div className="relative mt-5 space-y-3">
          <div className="ml-auto max-w-[86%] rounded-2xl rounded-br-md bg-white px-4 py-3 text-sm text-black">{lastPrompt}</div>
          <div className="max-w-[94%] rounded-2xl rounded-bl-md border border-white/[0.08] bg-black/20 px-4 py-3 text-sm leading-6 text-white/65">
            <span className="mb-2 flex items-center gap-1.5 text-xs font-medium text-violet-300"><Sparkles className="size-3" /> Nexora AI</span>
            I&apos;ve captured that request. The UI is ready for a live AI model connection, so the next step is wiring this panel to your preferred AI API and workspace data.
          </div>
        </div>
      ) : (
        <div className="relative mt-5 rounded-2xl border border-white/[0.07] bg-black/20 p-4">
          <p className="text-sm leading-6 text-white/55">
            I found one workflow that needs attention and two opportunities to automate repetitive work today.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs text-white/45">
              <WandSparkles className="size-3.5 text-violet-300" /> Create lead follow-up automation
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs text-white/45">
              <FileText className="size-3.5 text-cyan-300" /> Summarize launch project
            </div>
          </div>
        </div>
      )}

      <div className="relative mt-4 flex flex-wrap gap-2">
        {prompts.slice(0, compact ? 2 : 3).map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setInput(prompt)}
            className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs text-white/45 transition hover:bg-white/[0.06] hover:text-white"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="relative mt-4 flex items-end gap-2 rounded-2xl border border-white/[0.09] bg-black/30 p-2 focus-within:border-violet-400/25">
        <textarea
          rows={compact ? 1 : 3}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask Nexora AI anything..."
          className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-5 text-white outline-none placeholder:text-white/25"
        />
        <button
          type="submit"
          aria-label="Send prompt"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-500 text-white transition hover:bg-violet-400"
        >
          <ArrowUp className="size-4" />
        </button>
      </form>

      {compact && (
        <Link href="/dashboard/copilot" className="relative mt-4 inline-block text-xs font-medium text-violet-300 hover:text-violet-200">
          Open full Copilot →
        </Link>
      )}
    </section>
  );
}
