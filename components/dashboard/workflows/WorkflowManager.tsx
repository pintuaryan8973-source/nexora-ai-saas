"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bot,
  CalendarClock,
  ChevronDown,
  Clock3,
  FileInput,
  Filter,
  Mail,
  Pause,
  PencilLine,
  Play,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
  Webhook,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import {
  createWorkflow,
  deleteWorkflow,
  setWorkflowStatus,
  type WorkflowActionResult,
} from "@/app/dashboard/workflows/actions";
import {
  actionLabel,
  statusLabel,
  triggerLabel,
  workflowActions,
  workflowStatuses,
  workflowTriggers,
  type WorkflowActionType,
  type WorkflowRecord,
  type WorkflowStatus,
  type WorkflowTriggerType,
} from "@/lib/workflows";

type FilterValue = "all" | WorkflowStatus;

const triggerIcons: Record<WorkflowTriggerType, typeof Play> = {
  manual: Play,
  schedule: CalendarClock,
  form: FileInput,
  email: Mail,
  calendar: CalendarClock,
  webhook: Webhook,
};

const actionIcons: Record<WorkflowActionType, typeof Bot> = {
  ai_task: Bot,
  email: Send,
  notification: Zap,
  webhook: Webhook,
  database: Workflow,
};

function dateLabel(value: string | null) {
  if (!value) return "Never run";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusClasses(status: WorkflowStatus) {
  if (status === "active") return "bg-emerald-400/10 text-emerald-300 ring-emerald-400/15";
  if (status === "paused") return "bg-amber-400/10 text-amber-300 ring-amber-400/15";
  return "bg-white/[0.05] text-white/45 ring-white/[0.08]";
}

export default function WorkflowManager({
  initialWorkflows,
  initialOpen = false,
  setupError = "",
}: {
  initialWorkflows: WorkflowRecord[];
  initialOpen?: boolean;
  setupError?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(initialOpen);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return initialWorkflows.filter((workflow) => {
      const statusMatch = filter === "all" || workflow.status === filter;
      const textMatch =
        !normalized ||
        workflow.name.toLowerCase().includes(normalized) ||
        workflow.description.toLowerCase().includes(normalized) ||
        triggerLabel(workflow.trigger_type).toLowerCase().includes(normalized) ||
        actionLabel(workflow.action_type).toLowerCase().includes(normalized);

      return statusMatch && textMatch;
    });
  }, [filter, initialWorkflows, query]);

  const counts = useMemo(
    () => ({
      all: initialWorkflows.length,
      active: initialWorkflows.filter((item) => item.status === "active").length,
      paused: initialWorkflows.filter((item) => item.status === "paused").length,
      draft: initialWorkflows.filter((item) => item.status === "draft").length,
    }),
    [initialWorkflows],
  );

  function runAction(action: () => Promise<WorkflowActionResult>) {
    setActionError("");

    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setActionError(result.error ?? "Something went wrong.");
        return;
      }
      router.refresh();
    });
  }

  function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createWorkflow(formData);
      if (!result.ok) {
        setFormError(result.error ?? "Could not create workflow.");
        return;
      }

      form.reset();
      setOpen(false);
      router.replace("/dashboard/workflows");
      router.refresh();
    });
  }

  return (
    <>
      {setupError && (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.07] p-4 text-sm text-amber-100">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-400/10 text-amber-300">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="font-medium">One-time database setup required</p>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-amber-100/60">{setupError}</p>
            </div>
          </div>
        </div>
      )}

      {actionError && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-sm text-rose-200">
          {actionError}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c13]">
        <div className="flex flex-col gap-4 border-b border-white/[0.07] p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["all", "active", "paused", "draft"] as FilterValue[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                  filter === item
                    ? "border-violet-400/20 bg-violet-500/12 text-violet-200"
                    : "border-white/[0.07] bg-white/[0.025] text-white/40 hover:bg-white/[0.05] hover:text-white/70"
                }`}
              >
                {item === "all" ? "All" : statusLabel(item)}
                <span className="ml-2 text-white/25">{counts[item]}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative min-w-0 sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/25" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="Search workflows..."
                className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-9 pr-3 text-sm outline-none placeholder:text-white/25 focus:border-violet-400/30"
              />
            </label>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              <Plus className="size-4" /> New workflow
            </button>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-2 2xl:grid-cols-3">
            {filtered.map((workflow) => {
              const TriggerIcon = triggerIcons[workflow.trigger_type];
              const ActionIcon = actionIcons[workflow.action_type];
              const nextStatus: WorkflowStatus = workflow.status === "active" ? "paused" : "active";

              return (
                <article
                  key={workflow.id}
                  className="group rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.035] to-white/[0.015] p-5 transition hover:-translate-y-0.5 hover:border-violet-400/15"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-11 place-items-center rounded-2xl border border-violet-400/10 bg-violet-500/10 text-violet-300">
                      <Workflow className="size-5" />
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] ring-1 ring-inset ${statusClasses(workflow.status)}`}>
                      {statusLabel(workflow.status)}
                    </span>
                  </div>

                  <h2 className="mt-5 text-base font-semibold">{workflow.name}</h2>
                  <p className="mt-2 min-h-10 text-sm leading-5 text-white/35">
                    {workflow.description || "No description added yet."}
                  </p>

                  <div className="mt-5 grid gap-2">
                    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/15 px-3 py-2.5">
                      <span className="grid size-8 place-items-center rounded-lg bg-white/[0.04] text-white/45">
                        <TriggerIcon className="size-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-white/20">Trigger</p>
                        <p className="mt-0.5 truncate text-xs text-white/60">{triggerLabel(workflow.trigger_type)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/15 px-3 py-2.5">
                      <span className="grid size-8 place-items-center rounded-lg bg-white/[0.04] text-white/45">
                        <ActionIcon className="size-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-white/20">Action</p>
                        <p className="mt-0.5 truncate text-xs text-white/60">{actionLabel(workflow.action_type)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4 text-[11px] text-white/30">
                    <span>{workflow.run_count} runs tracked</span>
                    <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3" /> {dateLabel(workflow.last_run_at)}</span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => runAction(() => setWorkflowStatus(workflow.id, nextStatus))}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] text-xs font-medium text-white/65 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
                    >
                      {workflow.status === "active" ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                      {workflow.status === "active" ? "Pause" : "Activate"}
                    </button>

                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => {
                        if (window.confirm(`Delete “${workflow.name}”? This cannot be undone.`)) {
                          runAction(() => deleteWorkflow(workflow.id));
                        }
                      }}
                      aria-label={`Delete ${workflow.name}`}
                      className="grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-white/30 transition hover:border-rose-400/20 hover:bg-rose-500/10 hover:text-rose-200 disabled:opacity-40"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="grid min-h-[360px] place-items-center p-8 text-center">
            <div className="max-w-md">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-violet-400/15 bg-violet-500/10 text-violet-300">
                <Workflow className="size-6" />
              </span>
              <h2 className="mt-5 text-lg font-semibold">
                {initialWorkflows.length === 0 ? "Create your first workflow" : "No workflows match this view"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/35">
                {initialWorkflows.length === 0
                  ? "Start with a trigger and an action. Nexora will save the workflow securely to your account."
                  : "Try another search term or status filter."}
              </p>
              {initialWorkflows.length === 0 && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black"
                >
                  <Plus className="size-4" /> New workflow
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close workflow creator"
            onClick={() => !pending && setOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/[0.1] bg-[#0b0b13] shadow-2xl shadow-black/60">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.07] bg-[#0b0b13]/95 px-5 py-4 backdrop-blur-xl sm:px-6">
              <div>
                <p className="text-sm font-semibold">Create workflow</p>
                <p className="mt-1 text-xs text-white/30">Set the foundation now. Connectors and execution logic can be added next.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="grid size-9 place-items-center rounded-xl text-white/40 hover:bg-white/[0.05] hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={submitCreate} className="space-y-6 p-5 sm:p-6">
              {formError && (
                <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-xs text-rose-200">
                  {formError}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-medium text-white/55">Workflow name</span>
                  <input
                    name="name"
                    required
                    minLength={2}
                    maxLength={120}
                    placeholder="e.g. Weekly client summary"
                    className="h-11 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] px-3.5 text-sm outline-none placeholder:text-white/20 focus:border-violet-400/35"
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-medium text-white/55">Description</span>
                  <textarea
                    name="description"
                    maxLength={600}
                    rows={3}
                    placeholder="What should this workflow help you accomplish?"
                    className="w-full resize-none rounded-xl border border-white/[0.09] bg-white/[0.035] px-3.5 py-3 text-sm outline-none placeholder:text-white/20 focus:border-violet-400/35"
                  />
                </label>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-white/55">Trigger</p>
                    <p className="mt-1 text-[11px] text-white/25">Choose what starts this workflow.</p>
                  </div>
                  <Filter className="size-4 text-white/20" />
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {workflowTriggers.map((item) => {
                    const Icon = triggerIcons[item.value];
                    return (
                      <label key={item.value} className="group cursor-pointer">
                        <input
                          className="peer sr-only"
                          type="radio"
                          name="trigger_type"
                          value={item.value}
                          defaultChecked={item.value === "manual"}
                        />
                        <span className="flex h-full gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition peer-checked:border-violet-400/25 peer-checked:bg-violet-500/[0.08]">
                          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-white/45 group-hover:text-white/70">
                            <Icon className="size-4" />
                          </span>
                          <span>
                            <span className="block text-xs font-medium text-white/70">{item.label}</span>
                            <span className="mt-1 block text-[11px] leading-4 text-white/25">{item.description}</span>
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <p className="text-xs font-medium text-white/55">Action</p>
                  <p className="mt-1 text-[11px] text-white/25">Choose what Nexora should do next.</p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {workflowActions.map((item) => {
                    const Icon = actionIcons[item.value];
                    return (
                      <label key={item.value} className="group cursor-pointer">
                        <input
                          className="peer sr-only"
                          type="radio"
                          name="action_type"
                          value={item.value}
                          defaultChecked={item.value === "ai_task"}
                        />
                        <span className="flex h-full gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition peer-checked:border-violet-400/25 peer-checked:bg-violet-500/[0.08]">
                          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-white/45 group-hover:text-white/70">
                            <Icon className="size-4" />
                          </span>
                          <span>
                            <span className="block text-xs font-medium text-white/70">{item.label}</span>
                            <span className="mt-1 block text-[11px] leading-4 text-white/25">{item.description}</span>
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-white/55">Initial status</span>
                <div className="relative">
                  <select
                    name="status"
                    defaultValue="active"
                    className="h-11 w-full appearance-none rounded-xl border border-white/[0.09] bg-white/[0.035] px-3.5 pr-10 text-sm text-white/70 outline-none focus:border-violet-400/35"
                  >
                    {workflowStatuses.map((item) => (
                      <option key={item.value} value={item.value} className="bg-[#11111a]">
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white/25" />
                </div>
              </label>

              <div className="flex flex-col-reverse gap-2 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setOpen(false)}
                  className="h-10 rounded-xl border border-white/[0.08] px-4 text-sm text-white/50 hover:bg-white/[0.04] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending || Boolean(setupError)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pending ? "Saving..." : "Create workflow"}
                  {!pending && <ArrowRight className="size-4" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
