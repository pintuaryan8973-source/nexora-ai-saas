"use client";

import {
  FormEvent,
  useMemo,
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  FileInput,
  Filter,
  History,
  Loader2,
  Mail,
  Pause,
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

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import ScheduleSettingsModal from "@/components/dashboard/workflows/ScheduleSettingsModal";

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

type FilterValue =
  | "all"
  | WorkflowStatus;

type RunStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";

type WorkflowRunLog = {
  id: number;
  run_id: string;

  level:
    | "info"
    | "success"
    | "warning"
    | "error";

  message: string;

  metadata: Record<
    string,
    unknown
  >;

  created_at: string;
};

type WorkflowRun = {
  id: string;
  workflow_id: string;
  status: RunStatus;
  trigger_source: string;

  input_data: Record<
    string,
    unknown
  >;

  output_data: Record<
    string,
    unknown
  >;

  error_message:
    | string
    | null;

  started_at:
    | string
    | null;

  completed_at:
    | string
    | null;

  duration_ms:
    | number
    | null;

  created_at: string;

  logs: WorkflowRunLog[];
};

const triggerIcons: Record<
  WorkflowTriggerType,
  typeof Play
> = {
  manual: Play,
  schedule: CalendarClock,
  form: FileInput,
  email: Mail,
  calendar: CalendarClock,
  webhook: Webhook,
};

const actionIcons: Record<
  WorkflowActionType,
  typeof Bot
> = {
  ai_task: Bot,
  email: Send,
  notification: Zap,
  webhook: Webhook,
  database: Workflow,
};

function dateLabel(
  value: string | null
) {
  if (!value) {
    return "Never run";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      timeZone:
        "Asia/Kolkata",

      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  ).format(
    new Date(value)
  );
}

function durationLabel(
  value: number | null
) {
  if (value === null) {
    return "—";
  }

  if (value < 1000) {
    return `${value} ms`;
  }

  return `${(
    value / 1000
  ).toFixed(2)} sec`;
}

function statusClasses(
  status: WorkflowStatus
) {
  if (status === "active") {
    return "bg-emerald-400/10 text-emerald-300 ring-emerald-400/15";
  }

  if (status === "paused") {
    return "bg-amber-400/10 text-amber-300 ring-amber-400/15";
  }

  return "bg-white/[0.05] text-white/45 ring-white/[0.08]";
}

function runStatusClasses(
  status: RunStatus
) {
  if (status === "succeeded") {
    return "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300";
  }

  if (status === "failed") {
    return "border-rose-400/20 bg-rose-400/[0.08] text-rose-300";
  }

  if (status === "running") {
    return "border-violet-400/20 bg-violet-400/[0.08] text-violet-200";
  }

  if (status === "cancelled") {
    return "border-white/10 bg-white/[0.04] text-white/40";
  }

  return "border-amber-400/20 bg-amber-400/[0.08] text-amber-200";
}

export default function WorkflowManager({
  initialWorkflows,
  initialOpen = false,
  setupError = "",
}: {
  initialWorkflows:
    WorkflowRecord[];

  initialOpen?: boolean;

  setupError?: string;
}) {
  const router =
    useRouter();

  const [open, setOpen] =
    useState(initialOpen);

  const [query, setQuery] =
    useState("");

  const [filter, setFilter] =
    useState<FilterValue>(
      "all"
    );

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    actionError,
    setActionError,
  ] = useState("");

  const [
    runNotice,
    setRunNotice,
  ] = useState<{
    type:
      | "success"
      | "error";

    text: string;
  } | null>(null);

  const [
    runningWorkflowId,
    setRunningWorkflowId,
  ] =
    useState<
      string | null
    >(null);

  const [
    historyWorkflow,
    setHistoryWorkflow,
  ] =
    useState<
      WorkflowRecord | null
    >(null);

  const [
    historyOpen,
    setHistoryOpen,
  ] = useState(false);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(false);

  const [
    historyError,
    setHistoryError,
  ] = useState("");

  const [
    runHistory,
    setRunHistory,
  ] =
    useState<
      WorkflowRun[]
    >([]);

  // =========================
  // RUN INPUT MODAL
  // =========================

  const [
    runInputOpen,
    setRunInputOpen,
  ] = useState(false);

  const [
    selectedWorkflow,
    setSelectedWorkflow,
  ] =
    useState<
      WorkflowRecord | null
    >(null);

  const [
    runInput,
    setRunInput,
  ] = useState("");

  // =========================
  // SCHEDULE MODAL
  // =========================

  const [
    scheduleWorkflow,
    setScheduleWorkflow,
  ] =
    useState<
      WorkflowRecord | null
    >(null);

  const [
    scheduleOpen,
    setScheduleOpen,
  ] = useState(false);

  const [
    pending,
    startTransition,
  ] = useTransition();

  const filtered =
    useMemo(() => {
      const normalized =
        query
          .trim()
          .toLowerCase();

      return initialWorkflows.filter(
        (workflow) => {
          const statusMatch =
            filter ===
              "all" ||
            workflow.status ===
              filter;

          const textMatch =
            !normalized ||
            workflow.name
              .toLowerCase()
              .includes(
                normalized
              ) ||
            workflow.description
              .toLowerCase()
              .includes(
                normalized
              ) ||
            triggerLabel(
              workflow.trigger_type
            )
              .toLowerCase()
              .includes(
                normalized
              ) ||
            actionLabel(
              workflow.action_type
            )
              .toLowerCase()
              .includes(
                normalized
              );

          return (
            statusMatch &&
            textMatch
          );
        }
      );
    }, [
      filter,
      initialWorkflows,
      query,
    ]);

  const counts =
    useMemo(
      () => ({
        all:
          initialWorkflows.length,

        active:
          initialWorkflows.filter(
            (item) =>
              item.status ===
              "active"
          ).length,

        paused:
          initialWorkflows.filter(
            (item) =>
              item.status ===
              "paused"
          ).length,

        draft:
          initialWorkflows.filter(
            (item) =>
              item.status ===
              "draft"
          ).length,
      }),
      [initialWorkflows]
    );

  function runAction(
    action: () =>
      Promise<WorkflowActionResult>
  ) {
    setActionError("");

    startTransition(
      async () => {
        const result =
          await action();

        if (!result.ok) {
          setActionError(
            result.error ??
              "Something went wrong."
          );

          return;
        }

        router.refresh();
      }
    );
  }

  function submitCreate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setFormError("");

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    startTransition(
      async () => {
        const result =
          await createWorkflow(
            formData
          );

        if (!result.ok) {
          setFormError(
            result.error ??
              "Could not create workflow."
          );

          return;
        }

        form.reset();

        setOpen(false);

        router.replace(
          "/dashboard/workflows"
        );

        router.refresh();
      }
    );
  }

  // =========================
  // OPEN RUN INPUT
  // =========================

  function openRunInput(
    workflow:
      WorkflowRecord
  ) {
    if (
      workflow.status !==
      "active"
    ) {
      setRunNotice({
        type: "error",

        text:
          "Activate this workflow before running it.",
      });

      return;
    }

    if (
      workflow.action_type !==
      "ai_task"
    ) {
      setRunNotice({
        type: "error",

        text: `${actionLabel(
          workflow.action_type
        )} integration is not connected yet.`,
      });

      return;
    }

    setSelectedWorkflow(
      workflow
    );

    setRunInput("");

    setRunInputOpen(true);

    setRunNotice(null);
  }

  // =========================
  // EXECUTE WORKFLOW
  // =========================

  async function executeWorkflow() {
    if (!selectedWorkflow) {
      return;
    }

    const workflow =
      selectedWorkflow;

    setRunInputOpen(false);

    setRunningWorkflowId(
      workflow.id
    );

    setRunNotice(null);

    setActionError("");

    try {
      const response =
        await fetch(
          `/api/workflows/${workflow.id}/run`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              input: {
                context:
                  runInput.trim() ||
                  "No additional run context was provided.",
              },
            }),
          }
        );

      const raw =
        await response.text();

      let data: {
        success?: boolean;
        error?: string;
        runId?: string;
      } = {};

      if (raw) {
        try {
          data =
            JSON.parse(raw);
        } catch {
          throw new Error(
            "Workflow API returned an invalid response."
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Workflow execution failed."
        );
      }

      setRunNotice({
        type: "success",

        text: `${workflow.name} completed successfully.`,
      });

      setRunInput("");

      setSelectedWorkflow(
        null
      );

      router.refresh();

      await openRunHistory(
        workflow
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Workflow execution failed.";

      setRunNotice({
        type: "error",
        text: message,
      });

      await openRunHistory(
        workflow
      );
    } finally {
      setRunningWorkflowId(
        null
      );
    }
  }

  // =========================
  // RUN HISTORY
  // =========================

  async function openRunHistory(
    workflow:
      WorkflowRecord
  ) {
    setHistoryWorkflow(
      workflow
    );

    setHistoryOpen(true);

    setHistoryLoading(true);

    setHistoryError("");

    try {
      const response =
        await fetch(
          `/api/workflows/${workflow.id}/run`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

      const raw =
        await response.text();

      if (!raw) {
        throw new Error(
          "Run history returned an empty response."
        );
      }

      let data;

      try {
        data =
          JSON.parse(raw);
      } catch {
        throw new Error(
          "Run history API returned invalid JSON."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to load run history."
        );
      }

      setRunHistory(
        data.runs ?? []
      );
    } catch (error) {
      setRunHistory([]);

      setHistoryError(
        error instanceof Error
          ? error.message
          : "Unable to load run history."
      );
    } finally {
      setHistoryLoading(
        false
      );
    }
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
              <p className="font-medium">
                One-time database
                setup required
              </p>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-amber-100/60">
                {setupError}
              </p>
            </div>
          </div>
        </div>
      )}

      {actionError && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-sm text-rose-200">
          {actionError}
        </div>
      )}

      {runNotice && (
        <div
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
            runNotice.type ===
            "success"
              ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-200"
              : "border-rose-400/20 bg-rose-400/[0.07] text-rose-200"
          }`}
        >
          {runNotice.type ===
          "success" ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          ) : (
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
          )}

          <span>
            {runNotice.text}
          </span>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c13]">
        <div className="flex flex-col gap-4 border-b border-white/[0.07] p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {(
              [
                "all",
                "active",
                "paused",
                "draft",
              ] as FilterValue[]
            ).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setFilter(item)
                }
                className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                  filter === item
                    ? "border-violet-400/20 bg-violet-500/12 text-violet-200"
                    : "border-white/[0.07] bg-white/[0.025] text-white/40 hover:bg-white/[0.05] hover:text-white/70"
                }`}
              >
                {item === "all"
                  ? "All"
                  : statusLabel(
                      item
                    )}

                <span className="ml-2 text-white/25">
                  {counts[item]}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative min-w-0 sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/25" />

              <input
                value={query}
                onChange={(
                  event
                ) =>
                  setQuery(
                    event.target
                      .value
                  )
                }
                type="search"
                placeholder="Search workflows..."
                className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-9 pr-3 text-sm outline-none placeholder:text-white/25 focus:border-violet-400/30"
              />
            </label>

            <button
              type="button"
              onClick={() =>
                setOpen(true)
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              <Plus className="size-4" />
              New workflow
            </button>
          </div>
        </div>

        {filtered.length >
        0 ? (
          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-2 2xl:grid-cols-3">
            {filtered.map(
              (workflow) => {
                const TriggerIcon =
                  triggerIcons[
                    workflow
                      .trigger_type
                  ];

                const ActionIcon =
                  actionIcons[
                    workflow
                      .action_type
                  ];

                const nextStatus:
                  WorkflowStatus =
                  workflow.status ===
                  "active"
                    ? "paused"
                    : "active";

                const isRunning =
                  runningWorkflowId ===
                  workflow.id;

                const canExecute =
                  workflow.status ===
                    "active" &&
                  workflow.action_type ===
                    "ai_task";

                return (
                  <article
                    key={
                      workflow.id
                    }
                    className="group rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.035] to-white/[0.015] p-5 transition hover:-translate-y-0.5 hover:border-violet-400/15"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid size-11 place-items-center rounded-2xl border border-violet-400/10 bg-violet-500/10 text-violet-300">
                        <Workflow className="size-5" />
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] ring-1 ring-inset ${statusClasses(
                          workflow.status
                        )}`}
                      >
                        {statusLabel(
                          workflow.status
                        )}
                      </span>
                    </div>

                    <h2 className="mt-5 text-base font-semibold">
                      {
                        workflow.name
                      }
                    </h2>

                    <p className="mt-2 min-h-10 text-sm leading-5 text-white/35">
                      {workflow.description ||
                        "No description added yet."}
                    </p>

                    <div className="mt-5 grid gap-2">
                      <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/15 px-3 py-2.5">
                        <span className="grid size-8 place-items-center rounded-lg bg-white/[0.04] text-white/45">
                          <TriggerIcon className="size-3.5" />
                        </span>

                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/20">
                            Trigger
                          </p>

                          <p className="mt-0.5 truncate text-xs text-white/60">
                            {triggerLabel(
                              workflow.trigger_type
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/15 px-3 py-2.5">
                        <span className="grid size-8 place-items-center rounded-lg bg-white/[0.04] text-white/45">
                          <ActionIcon className="size-3.5" />
                        </span>

                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/20">
                            Action
                          </p>

                          <p className="mt-0.5 truncate text-xs text-white/60">
                            {actionLabel(
                              workflow.action_type
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4 text-[11px] text-white/30">
                      <span>
                        {
                          workflow.run_count
                        }{" "}
                        runs tracked
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="size-3" />

                        {dateLabel(
                          workflow.last_run_at
                        )}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={
                          pending ||
                          isRunning ||
                          !canExecute
                        }
                        onClick={() =>
                          openRunInput(
                            workflow
                          )
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-500/15 text-xs font-semibold text-violet-200 ring-1 ring-inset ring-violet-400/15 transition hover:bg-violet-500/25 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        {isRunning ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" />
                            Running...
                          </>
                        ) : workflow.action_type !==
                          "ai_task" ? (
                          <>
                            <Zap className="size-3.5" />
                            Pending
                          </>
                        ) : (
                          <>
                            <Play className="size-3.5" />
                            Run Now
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={
                          isRunning
                        }
                        onClick={() =>
                          openRunHistory(
                            workflow
                          )
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] text-xs font-medium text-white/60 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
                      >
                        <History className="size-3.5" />
                        Run History
                      </button>

                      {workflow.trigger_type ===
                        "schedule" && (
                        <button
                          type="button"
                          onClick={() => {
                            setScheduleWorkflow(
                              workflow
                            );

                            setScheduleOpen(
                              true
                            );
                          }}
                          className="col-span-2 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-violet-400/15 bg-violet-500/[0.07] text-xs font-medium text-violet-200 transition hover:bg-violet-500/[0.14]"
                        >
                          <CalendarClock className="size-3.5" />

                          Schedule
                          Settings
                        </button>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        disabled={
                          pending ||
                          isRunning
                        }
                        onClick={() =>
                          runAction(
                            () =>
                              setWorkflowStatus(
                                workflow.id,
                                nextStatus
                              )
                          )
                        }
                        className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] text-xs font-medium text-white/65 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
                      >
                        {workflow.status ===
                        "active" ? (
                          <Pause className="size-3.5" />
                        ) : (
                          <Play className="size-3.5" />
                        )}

                        {workflow.status ===
                        "active"
                          ? "Pause"
                          : "Activate"}
                      </button>

                      <button
                        type="button"
                        disabled={
                          pending ||
                          isRunning
                        }
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete “${workflow.name}”? This cannot be undone.`
                            )
                          ) {
                            runAction(
                              () =>
                                deleteWorkflow(
                                  workflow.id
                                )
                            );
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
              }
            )}
          </div>
        ) : (
          <div className="grid min-h-[360px] place-items-center p-8 text-center">
            <div className="max-w-md">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-violet-400/15 bg-violet-500/10 text-violet-300">
                <Workflow className="size-6" />
              </span>

              <h2 className="mt-5 text-lg font-semibold">
                {initialWorkflows.length ===
                0
                  ? "Create your first workflow"
                  : "No workflows match this view"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/35">
                {initialWorkflows.length ===
                0
                  ? "Create an AI workflow and execute it directly from Nexora."
                  : "Try another search term or status filter."}
              </p>

              {initialWorkflows.length ===
                0 && (
                <button
                  type="button"
                  onClick={() =>
                    setOpen(true)
                  }
                  className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black"
                >
                  <Plus className="size-4" />
                  New workflow
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* CREATE WORKFLOW */}

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close workflow creator"
            onClick={() =>
              !pending &&
              setOpen(false)
            }
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/[0.1] bg-[#0b0b13] shadow-2xl shadow-black/60">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.07] bg-[#0b0b13]/95 px-5 py-4 backdrop-blur-xl sm:px-6">
              <div>
                <p className="text-sm font-semibold">
                  Create workflow
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Build a reusable
                  workflow.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                disabled={pending}
                className="grid size-9 place-items-center rounded-xl text-white/40 hover:bg-white/[0.05] hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={
                submitCreate
              }
              className="space-y-6 p-5 sm:p-6"
            >
              {formError && (
                <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-xs text-rose-200">
                  {formError}
                </div>
              )}

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-white/55">
                  Workflow name
                </span>

                <input
                  name="name"
                  required
                  minLength={2}
                  maxLength={120}
                  placeholder="Weekly client summary"
                  className="h-11 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] px-3.5 text-sm outline-none placeholder:text-white/20 focus:border-violet-400/35"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-white/55">
                  Description
                </span>

                <textarea
                  name="description"
                  maxLength={600}
                  rows={3}
                  placeholder="What should this workflow do?"
                  className="w-full resize-none rounded-xl border border-white/[0.09] bg-white/[0.035] px-3.5 py-3 text-sm outline-none placeholder:text-white/20 focus:border-violet-400/35"
                />
              </label>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-white/55">
                    Trigger
                  </p>

                  <Filter className="size-4 text-white/20" />
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {workflowTriggers.map(
                    (item) => {
                      const Icon =
                        triggerIcons[
                          item.value
                        ];

                      return (
                        <label
                          key={
                            item.value
                          }
                          className="cursor-pointer"
                        >
                          <input
                            className="peer sr-only"
                            type="radio"
                            name="trigger_type"
                            value={
                              item.value
                            }
                            defaultChecked={
                              item.value ===
                              "manual"
                            }
                          />

                          <span className="flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5 peer-checked:border-violet-400/25 peer-checked:bg-violet-500/[0.08]">
                            <Icon className="size-4 text-white/50" />

                            <span>
                              <span className="block text-xs font-medium text-white/70">
                                {
                                  item.label
                                }
                              </span>

                              <span className="mt-1 block text-[11px] text-white/25">
                                {
                                  item.description
                                }
                              </span>
                            </span>
                          </span>
                        </label>
                      );
                    }
                  )}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium text-white/55">
                  Action
                </p>

                <div className="grid gap-2 sm:grid-cols-2">
                  {workflowActions.map(
                    (item) => {
                      const Icon =
                        actionIcons[
                          item.value
                        ];

                      return (
                        <label
                          key={
                            item.value
                          }
                          className="cursor-pointer"
                        >
                          <input
                            className="peer sr-only"
                            type="radio"
                            name="action_type"
                            value={
                              item.value
                            }
                            defaultChecked={
                              item.value ===
                              "ai_task"
                            }
                          />

                          <span className="flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5 peer-checked:border-violet-400/25 peer-checked:bg-violet-500/[0.08]">
                            <Icon className="size-4 text-white/50" />

                            <span>
                              <span className="block text-xs font-medium text-white/70">
                                {
                                  item.label
                                }
                              </span>

                              <span className="mt-1 block text-[11px] text-white/25">
                                {
                                  item.description
                                }
                              </span>
                            </span>
                          </span>
                        </label>
                      );
                    }
                  )}
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-medium text-white/55">
                  Initial status
                </span>

                <div className="relative">
                  <select
                    name="status"
                    defaultValue="active"
                    className="h-11 w-full appearance-none rounded-xl border border-white/[0.09] bg-[#11111a] px-3.5 pr-10 text-sm text-white/70 outline-none"
                  >
                    {workflowStatuses.map(
                      (item) => (
                        <option
                          key={
                            item.value
                          }
                          value={
                            item.value
                          }
                        >
                          {
                            item.label
                          }
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white/25" />
                </div>
              </label>

              <div className="flex justify-end gap-2 border-t border-white/[0.07] pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setOpen(false)
                  }
                  className="h-10 rounded-xl border border-white/[0.08] px-4 text-sm text-white/50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    pending
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black disabled:opacity-50"
                >
                  {pending
                    ? "Saving..."
                    : "Create workflow"}

                  {!pending && (
                    <ArrowRight className="size-4" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INPUT MODAL */}

      {runInputOpen &&
        selectedWorkflow && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <button
              type="button"
              onClick={() => {
                setRunInputOpen(
                  false
                );

                setSelectedWorkflow(
                  null
                );
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/[0.1] bg-[#0b0b13]">
              <div className="flex items-start justify-between border-b border-white/[0.07] p-5">
                <div>
                  <div className="flex items-center gap-2 text-xs text-violet-300">
                    <Sparkles className="size-4" />
                    Run AI workflow
                  </div>

                  <h2 className="mt-2 text-xl font-semibold">
                    {
                      selectedWorkflow.name
                    }
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRunInputOpen(
                      false
                    );

                    setSelectedWorkflow(
                      null
                    );
                  }}
                >
                  <X className="size-4 text-white/40" />
                </button>
              </div>

              <div className="p-5">
                <textarea
                  value={runInput}
                  onChange={(
                    event
                  ) =>
                    setRunInput(
                      event.target
                        .value
                    )
                  }
                  rows={10}
                  maxLength={6000}
                  autoFocus
                  placeholder="Enter client/project information..."
                  className="w-full resize-none rounded-2xl border border-white/[0.09] bg-white/[0.035] p-4 text-sm leading-6 outline-none"
                />

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setRunInputOpen(
                        false
                      )
                    }
                    className="h-10 rounded-xl border border-white/[0.08] px-4 text-sm text-white/50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      executeWorkflow
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black"
                  >
                    <Play className="size-4" />
                    Run Workflow
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* HISTORY */}

      {historyOpen &&
        historyWorkflow && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
            <button
              type="button"
              onClick={() =>
                setHistoryOpen(
                  false
                )
              }
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0b0b13]">
              <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
                <div>
                  <div className="flex items-center gap-2 text-xs text-violet-300">
                    <History className="size-4" />
                    Execution history
                  </div>

                  <h2 className="mt-1 text-lg font-semibold">
                    {
                      historyWorkflow.name
                    }
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setHistoryOpen(
                      false
                    )
                  }
                >
                  <X className="size-4 text-white/40" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {historyLoading ? (
                  <div className="grid min-h-64 place-items-center">
                    <Loader2 className="size-6 animate-spin text-violet-300" />
                  </div>
                ) : historyError ? (
                  <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-4 text-rose-200">
                    {
                      historyError
                    }
                  </div>
                ) : runHistory.length ===
                  0 ? (
                  <p className="py-16 text-center text-sm text-white/30">
                    No runs yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {runHistory.map(
                      (run) => {
                        const result =
                          typeof run
                            .output_data
                            ?.result ===
                          "string"
                            ? run
                                .output_data
                                .result
                            : null;

                        return (
                          <article
                            key={
                              run.id
                            }
                            className="rounded-2xl border border-white/[0.08] bg-white/[0.025]"
                          >
                            <div className="flex items-center justify-between border-b border-white/[0.07] p-4">
                              <span
                                className={`rounded-full border px-2.5 py-1 text-[11px] ${runStatusClasses(
                                  run.status
                                )}`}
                              >
                                {
                                  run.status
                                }
                              </span>

                              <span className="text-xs text-white/35">
                                {durationLabel(
                                  run.duration_ms
                                )}
                              </span>
                            </div>

                            <div className="space-y-4 p-4">
                              {result && (
                                <div className="rounded-xl border border-violet-400/10 bg-violet-500/[0.05] p-4 text-sm leading-7 text-white/70 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_strong]:text-white">
                                  <ReactMarkdown
                                    remarkPlugins={[
                                      remarkGfm,
                                    ]}
                                  >
                                    {
                                      result
                                    }
                                  </ReactMarkdown>
                                </div>
                              )}

                              {run.error_message && (
                                <div className="text-sm text-rose-200">
                                  {
                                    run.error_message
                                  }
                                </div>
                              )}

                              {run.logs?.map(
                                (log) => (
                                  <div
                                    key={
                                      log.id
                                    }
                                    className="rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2 text-xs text-white/50"
                                  >
                                    {
                                      log.message
                                    }
                                  </div>
                                )
                              )}
                            </div>
                          </article>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* SCHEDULE SETTINGS */}

      <ScheduleSettingsModal
        workflow={
          scheduleWorkflow
        }
        open={scheduleOpen}
        onClose={() => {
          setScheduleOpen(
            false
          );

          setScheduleWorkflow(
            null
          );
        }}
      />
    </>
  );
}