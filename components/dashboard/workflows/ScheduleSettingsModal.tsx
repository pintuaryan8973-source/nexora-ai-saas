"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Loader2,
  Power,
  Trash2,
  X,
} from "lucide-react";

import type { WorkflowRecord } from "@/lib/workflows";

type ScheduleType =
  | "hourly"
  | "daily"
  | "weekly";

type ScheduleRecord = {
  id: string;
  workflow_id: string;
  enabled: boolean;
  cron_expression: string;
  timezone: string;
  next_run_at: string | null;
  last_run_at: string | null;

  last_status:
    | "never"
    | "running"
    | "succeeded"
    | "failed";

  last_error: string | null;
  created_at: string;
  updated_at: string;
};

type Props = {
  workflow: WorkflowRecord | null;
  open: boolean;
  onClose: () => void;
};

const DAYS = [
  {
    value: "1",
    label: "Monday",
  },
  {
    value: "2",
    label: "Tuesday",
  },
  {
    value: "3",
    label: "Wednesday",
  },
  {
    value: "4",
    label: "Thursday",
  },
  {
    value: "5",
    label: "Friday",
  },
  {
    value: "6",
    label: "Saturday",
  },
  {
    value: "0",
    label: "Sunday",
  },
];

const TIMEZONES = [
  {
    value: "Asia/Kolkata",
    label: "India — Asia/Kolkata",
  },
  {
    value: "UTC",
    label: "UTC",
  },
  {
    value: "Europe/London",
    label: "London — Europe/London",
  },
  {
    value: "America/New_York",
    label: "New York — America/New_York",
  },
  {
    value: "America/Los_Angeles",
    label: "Los Angeles — America/Los_Angeles",
  },
];

function createCron(
  type: ScheduleType,
  time: string,
  weekDay: string
) {
  const [
    hourText = "09",
    minuteText = "00",
  ] = time.split(":");

  const hour = Math.min(
    23,
    Math.max(
      0,
      Number(hourText) || 0
    )
  );

  const minute = Math.min(
    59,
    Math.max(
      0,
      Number(minuteText) || 0
    )
  );

  if (type === "hourly") {
    return `${minute} * * * *`;
  }

  if (type === "weekly") {
    return `${minute} ${hour} * * ${weekDay}`;
  }

  return `${minute} ${hour} * * *`;
}

function parseCron(
  cron: string
) {
  const parts =
    cron.trim().split(/\s+/);

  if (parts.length !== 5) {
    return {
      type:
        "daily" as ScheduleType,

      time: "09:00",
      weekDay: "1",
    };
  }

  const [
    minute,
    hour,
    ,
    ,
    weekDay,
  ] = parts;

  if (
    hour === "*" &&
    weekDay === "*"
  ) {
    return {
      type:
        "hourly" as ScheduleType,

      time: `00:${String(
        Number(minute) || 0
      ).padStart(2, "0")}`,

      weekDay: "1",
    };
  }

  const safeHour = Math.min(
    23,
    Math.max(
      0,
      Number(hour) || 0
    )
  );

  const safeMinute = Math.min(
    59,
    Math.max(
      0,
      Number(minute) || 0
    )
  );

  return {
    type:
      weekDay !== "*"
        ? ("weekly" as ScheduleType)
        : ("daily" as ScheduleType),

    time: `${String(
      safeHour
    ).padStart(
      2,
      "0"
    )}:${String(
      safeMinute
    ).padStart(
      2,
      "0"
    )}`,

    weekDay:
      weekDay !== "*"
        ? weekDay
        : "1",
  };
}

function formatDate(
  value: string | null,
  timezone: string
) {
  if (!value) {
    return "Not scheduled";
  }

  try {
    return new Intl.DateTimeFormat(
      "en-IN",
      {
        timeZone: timezone,
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(
      new Date(value)
    );
  } catch {
    return value;
  }
}

export default function ScheduleSettingsModal({
  workflow,
  open,
  onClose,
}: Props) {
  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    schedule,
    setSchedule,
  ] =
    useState<ScheduleRecord | null>(
      null
    );

  const [
    scheduleType,
    setScheduleType,
  ] =
    useState<ScheduleType>(
      "daily"
    );

  const [
    time,
    setTime,
  ] =
    useState("09:00");

  const [
    weekDay,
    setWeekDay,
  ] =
    useState("1");

  const [
    timezone,
    setTimezone,
  ] =
    useState(
      "Asia/Kolkata"
    );

  const [
    enabled,
    setEnabled,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const cronExpression =
    useMemo(
      () =>
        createCron(
          scheduleType,
          time,
          weekDay
        ),
      [
        scheduleType,
        time,
        weekDay,
      ]
    );

  // ============================================
  // LOAD SCHEDULE
  // ============================================

  useEffect(() => {
    if (!open) {
      return;
    }

    const workflowId =
      workflow?.id;

    if (!workflowId) {
      return;
    }

    let cancelled = false;

    async function loadSchedule() {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const response =
          await fetch(
            `/api/workflows/${workflowId}/schedule`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load schedule."
          );
        }

        if (cancelled) {
          return;
        }

        const existing =
          (data.schedule as
            | ScheduleRecord
            | null) ??
          null;

        setSchedule(existing);

        if (existing) {
          const parsed =
            parseCron(
              existing.cron_expression
            );

          setScheduleType(
            parsed.type
          );

          setTime(
            parsed.time
          );

          setWeekDay(
            parsed.weekDay
          );

          setTimezone(
            existing.timezone ||
              "Asia/Kolkata"
          );

          setEnabled(
            existing.enabled
          );
        } else {
          setScheduleType(
            "daily"
          );

          setTime(
            "09:00"
          );

          setWeekDay(
            "1"
          );

          setTimezone(
            "Asia/Kolkata"
          );

          setEnabled(true);
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load schedule."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSchedule();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    workflow?.id,
  ]);

  // ============================================
  // SAVE SCHEDULE
  // ============================================

  async function saveSchedule() {
    const workflowId =
      workflow?.id;

    if (!workflowId) {
      setError(
        "Workflow is not available."
      );

      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/workflows/${workflowId}/schedule`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                cronExpression,
                timezone,
                enabled,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to save schedule."
        );
      }

      setSchedule(
        data.schedule
      );

      setSuccess(
        "Schedule saved successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save schedule."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================
  // DELETE SCHEDULE
  // ============================================

  async function deleteSchedule() {
    const workflowId =
      workflow?.id;

    if (!workflowId) {
      setError(
        "Workflow is not available."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Remove this workflow schedule?"
      );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/workflows/${workflowId}/schedule`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to remove schedule."
        );
      }

      setSchedule(null);

      setSuccess(
        "Schedule removed successfully."
      );

      setScheduleType(
        "daily"
      );

      setTime(
        "09:00"
      );

      setWeekDay(
        "1"
      );

      setTimezone(
        "Asia/Kolkata"
      );

      setEnabled(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove schedule."
      );
    } finally {
      setDeleting(false);
    }
  }

  // ============================================
  // DO NOT RENDER WITHOUT WORKFLOW
  // ============================================

  if (
    !open ||
    !workflow
  ) {
    return null;
  }

  /*
   * Important:
   * workflow is confirmed above.
   * We store it in a non-null local constant.
   */
  const activeWorkflow:
    WorkflowRecord =
    workflow;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close schedule settings"
        onClick={
          onClose
        }
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/[0.1] bg-[#0b0b13] shadow-2xl shadow-black/60">

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/[0.07] bg-[#0b0b13]/95 px-5 py-5 backdrop-blur-xl sm:px-6">

          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-violet-300">
              <CalendarClock className="size-4" />

              Automation Scheduler
            </div>

            <h2 className="mt-2 text-xl font-semibold">
              {activeWorkflow.name}
            </h2>

            <p className="mt-1 text-sm text-white/35">
              Choose when Nexora
              should automatically
              run this workflow.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="grid size-9 shrink-0 place-items-center rounded-xl text-white/40 transition hover:bg-white/[0.05] hover:text-white"
          >
            <X className="size-4" />
          </button>

        </div>

        {/* BODY */}

        {loading ? (
          <div className="grid min-h-80 place-items-center p-6">

            <div className="text-center">

              <Loader2 className="mx-auto size-7 animate-spin text-violet-300" />

              <p className="mt-3 text-sm text-white/40">
                Loading schedule...
              </p>

            </div>

          </div>
        ) : (
          <div className="space-y-6 p-5 sm:p-6">

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3 text-sm text-emerald-200">
                <CheckCircle2 className="size-4" />

                {success}
              </div>
            )}

            {/* FREQUENCY */}

            <div>

              <p className="text-sm font-medium text-white/70">
                Frequency
              </p>

              <div className="mt-3 grid grid-cols-3 gap-2">

                {(
                  [
                    [
                      "hourly",
                      "Every Hour",
                    ],

                    [
                      "daily",
                      "Daily",
                    ],

                    [
                      "weekly",
                      "Weekly",
                    ],
                  ] as const
                ).map(
                  ([
                    value,
                    label,
                  ]) => (
                    <button
                      key={
                        value
                      }
                      type="button"
                      onClick={() =>
                        setScheduleType(
                          value
                        )
                      }
                      className={`min-h-11 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        scheduleType ===
                        value
                          ? "border-violet-400/30 bg-violet-500/15 text-violet-200"
                          : "border-white/[0.08] bg-white/[0.025] text-white/40 hover:bg-white/[0.05]"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}

              </div>

            </div>

            {/* TIME / DAY / TIMEZONE */}

            <div className="grid gap-4 sm:grid-cols-2">

              <label>

                <span className="mb-2 block text-xs font-medium text-white/55">
                  {scheduleType ===
                  "hourly"
                    ? "Run at minute"
                    : "Time"}
                </span>

                <input
                  type="time"
                  value={
                    time
                  }
                  onChange={(
                    event
                  ) =>
                    setTime(
                      event
                        .target
                        .value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] px-3.5 text-sm text-white outline-none focus:border-violet-400/35"
                />

                {scheduleType ===
                  "hourly" && (
                  <p className="mt-2 text-[11px] leading-5 text-white/25">
                    Example:
                    09:15 means
                    every hour at
                    minute 15.
                  </p>
                )}

              </label>

              {scheduleType ===
                "weekly" && (
                <label>

                  <span className="mb-2 block text-xs font-medium text-white/55">
                    Day
                  </span>

                  <select
                    value={
                      weekDay
                    }
                    onChange={(
                      event
                    ) =>
                      setWeekDay(
                        event
                          .target
                          .value
                      )
                    }
                    className="h-11 w-full rounded-xl border border-white/[0.09] bg-[#11111a] px-3.5 text-sm text-white/70 outline-none focus:border-violet-400/35"
                  >

                    {DAYS.map(
                      (
                        day
                      ) => (
                        <option
                          key={
                            day.value
                          }
                          value={
                            day.value
                          }
                        >
                          {
                            day.label
                          }
                        </option>
                      )
                    )}

                  </select>

                </label>
              )}

              <label>

                <span className="mb-2 block text-xs font-medium text-white/55">
                  Timezone
                </span>

                <select
                  value={
                    timezone
                  }
                  onChange={(
                    event
                  ) =>
                    setTimezone(
                      event
                        .target
                        .value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-white/[0.09] bg-[#11111a] px-3.5 text-sm text-white/70 outline-none focus:border-violet-400/35"
                >

                  {TIMEZONES.map(
                    (
                      zone
                    ) => (
                      <option
                        key={
                          zone.value
                        }
                        value={
                          zone.value
                        }
                      >
                        {
                          zone.label
                        }
                      </option>
                    )
                  )}

                </select>

              </label>

            </div>

            {/* ENABLE */}

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">

              <div>

                <p className="text-sm font-medium text-white/70">
                  Schedule enabled
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Turn this off to
                  temporarily stop
                  automatic runs.
                </p>

              </div>

              <button
                type="button"
                aria-label="Toggle schedule"
                onClick={() =>
                  setEnabled(
                    (
                      value
                    ) =>
                      !value
                  )
                }
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  enabled
                    ? "bg-violet-500"
                    : "bg-white/10"
                }`}
              >

                <span
                  className={`absolute top-1 size-5 rounded-full bg-white transition ${
                    enabled
                      ? "left-6"
                      : "left-1"
                  }`}
                />

              </button>

            </div>

            {/* CRON */}

            <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">

              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                Cron Expression
              </p>

              <code className="mt-2 block text-sm text-violet-200">
                {
                  cronExpression
                }
              </code>

            </div>

            {/* STATUS */}

            {schedule && (
              <div className="grid gap-3 sm:grid-cols-2">

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

                  <div className="flex items-center gap-2 text-xs text-white/30">

                    <Clock3 className="size-3.5" />

                    Next automatic run

                  </div>

                  <p className="mt-2 text-sm font-medium text-white/75">
                    {schedule.enabled
                      ? formatDate(
                          schedule.next_run_at,
                          schedule.timezone
                        )
                      : "Schedule paused"}
                  </p>

                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

                  <p className="text-xs text-white/30">
                    Last status
                  </p>

                  <p className="mt-2 text-sm font-medium capitalize text-white/75">
                    {
                      schedule.last_status
                    }
                  </p>

                </div>

              </div>
            )}

            {/* ERROR FROM LAST RUN */}

            {schedule?.last_error && (
              <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-4 text-sm text-rose-200">
                {
                  schedule.last_error
                }
              </div>
            )}

            {/* ACTIONS */}

            <div className="flex flex-col gap-2 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-between">

              <div>

                {schedule && (
                  <button
                    type="button"
                    disabled={
                      deleting ||
                      saving
                    }
                    onClick={
                      deleteSchedule
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-400/15 bg-rose-500/[0.07] px-4 text-sm text-rose-200 transition hover:bg-rose-500/15 disabled:opacity-40"
                  >

                    {deleting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}

                    Remove Schedule

                  </button>
                )}

              </div>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={
                    onClose
                  }
                  className="h-10 rounded-xl border border-white/[0.08] px-4 text-sm text-white/50 transition hover:bg-white/[0.04] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    saving ||
                    deleting
                  }
                  onClick={
                    saveSchedule
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
                >

                  {saving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Power className="size-4" />
                  )}

                  Save Schedule

                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}