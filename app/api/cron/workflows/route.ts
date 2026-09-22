import OpenAI from "openai";
import { NextResponse } from "next/server";
import { CronExpressionParser } from "cron-parser";

import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_WORKFLOWS_PER_RUN = 10;
const LOCK_MINUTES = 5;

type AdminClient = ReturnType<
  typeof createAdminClient
>;

type ScheduleRow = {
  id: string;
  workflow_id: string;
  user_id: string;
  enabled: boolean;
  cron_expression: string;
  timezone: string;
  next_run_at: string | null;
};

function nextRunDate(
  cronExpression: string,
  timezone: string,
  currentDate = new Date()
) {
  const interval =
    CronExpressionParser.parse(
      cronExpression,
      {
        currentDate,
        tz: timezone,
      }
    );

  return interval
    .next()
    .toDate()
    .toISOString();
}

async function addLog(
  admin: AdminClient,
  runId: string,
  userId: string,
  level:
    | "info"
    | "success"
    | "warning"
    | "error",
  message: string,
  metadata: Record<
    string,
    unknown
  > = {}
) {
  const { error } = await admin
    .from("workflow_run_logs")
    .insert({
      run_id: runId,
      user_id: userId,
      level,
      message,
      metadata,
    });

  if (error) {
    console.error(
      "Scheduler log error:",
      error
    );
  }
}

async function executeSchedule(
  admin: AdminClient,
  schedule: ScheduleRow
) {
  const now = new Date();

  const nowIso =
    now.toISOString();

  const lockUntil =
    new Date(
      now.getTime() +
        LOCK_MINUTES *
          60 *
          1000
    ).toISOString();

  /*
   * Claim the schedule.
   * This helps prevent two workers
   * from running the same schedule
   * at the same time.
   */
  const {
    data: claimedSchedule,
    error: claimError,
  } = await admin
    .from("workflow_schedules")
    .update({
      locked_until: lockUntil,
      last_status: "running",
      last_error: null,
    })
    .eq("id", schedule.id)
    .eq("enabled", true)
    .lte(
      "next_run_at",
      nowIso
    )
    .or(
      `locked_until.is.null,locked_until.lt.${nowIso}`
    )
    .select(
      `
      id,
      workflow_id,
      user_id,
      enabled,
      cron_expression,
      timezone,
      next_run_at
      `
    )
    .maybeSingle();

  if (claimError) {
    throw claimError;
  }

  if (!claimedSchedule) {
    return {
      scheduleId:
        schedule.id,
      skipped: true,
      reason:
        "Schedule already claimed or no longer due.",
    };
  }

  let runId:
    | string
    | null = null;

  try {
    const {
      data: workflow,
      error: workflowError,
    } = await admin
      .from("workflows")
      .select(
        `
        id,
        user_id,
        name,
        description,
        action_type,
        trigger_type,
        status,
        config
        `
      )
      .eq(
        "id",
        schedule.workflow_id
      )
      .eq(
        "user_id",
        schedule.user_id
      )
      .single();

    if (
      workflowError ||
      !workflow
    ) {
      throw new Error(
        "Scheduled workflow was not found."
      );
    }

    if (
      workflow.status !==
      "active"
    ) {
      throw new Error(
        "Workflow is not active."
      );
    }

    if (
      workflow.trigger_type !==
      "schedule"
    ) {
      throw new Error(
        "Workflow trigger is not set to Schedule."
      );
    }

    if (
      workflow.action_type !==
      "ai_task"
    ) {
      throw new Error(
        `${workflow.action_type} integration is not configured for automatic execution yet.`
      );
    }

    /*
     * Create execution history row.
     */
    const {
      data: run,
      error: createRunError,
    } = await admin
      .from("workflow_runs")
      .insert({
        workflow_id:
          workflow.id,
        user_id:
          workflow.user_id,
        status: "queued",
        trigger_source:
          "schedule",
        input_data: {
          scheduled: true,
          scheduledFor:
            claimedSchedule.next_run_at,
          timezone:
            schedule.timezone,
        },
      })
      .select("id")
      .single();

    if (
      createRunError ||
      !run
    ) {
      throw (
        createRunError ??
        new Error(
          "Unable to create scheduled run."
        )
      );
    }

    runId = run.id;

    await addLog(
      admin,
      run.id,
      workflow.user_id,
      "info",
      "Scheduled workflow run created.",
      {
        scheduleId:
          schedule.id,
      }
    );

    const startedAt =
      new Date().toISOString();

    const {
      error: startError,
    } = await admin
      .from("workflow_runs")
      .update({
        status: "running",
        started_at:
          startedAt,
      })
      .eq("id", run.id)
      .eq(
        "user_id",
        workflow.user_id
      );

    if (startError) {
      throw startError;
    }

    await addLog(
      admin,
      run.id,
      workflow.user_id,
      "info",
      "Automatic scheduled execution started."
    );

    if (
      !process.env
        .OPENAI_API_KEY
    ) {
      throw new Error(
        "OPENAI_API_KEY is not configured."
      );
    }

    const openai =
      new OpenAI({
        apiKey:
          process.env
            .OPENAI_API_KEY,
      });

    await addLog(
      admin,
      run.id,
      workflow.user_id,
      "info",
      "Sending scheduled task to Nexora AI."
    );

    const response =
      await openai.responses.create({
        model:
          "gpt-5.6-luna",

        instructions: `
You are the Nexora AI Workflow Scheduler.

You are executing an automatic scheduled workflow.

Use the workflow name, description and configuration to produce the requested result.

Return a useful professional result.

Use Markdown formatting when helpful.

Do not claim that an external action was completed unless that integration is actually connected.
        `.trim(),

        input: `
WORKFLOW NAME:
${workflow.name}

WORKFLOW DESCRIPTION:
${
  workflow.description ||
  "No description provided."
}

WORKFLOW CONFIGURATION:
${JSON.stringify(
  workflow.config ?? {},
  null,
  2
)}

SCHEDULE:
${schedule.cron_expression}

TIMEZONE:
${schedule.timezone}

EXECUTION TIME:
${new Date().toISOString()}
        `.trim(),
      });

    const aiResult =
      response.output_text?.trim() ||
      "Scheduled workflow completed without text output.";

    const outputData = {
      actionType:
        "ai_task",
      scheduled: true,
      result: aiResult,

      usage: {
        inputTokens:
          response.usage
            ?.input_tokens ??
          0,

        outputTokens:
          response.usage
            ?.output_tokens ??
          0,

        totalTokens:
          response.usage
            ?.total_tokens ??
          0,
      },
    };

    await addLog(
      admin,
      run.id,
      workflow.user_id,
      "success",
      "Nexora AI scheduled task completed."
    );

    const completedAt =
      new Date().toISOString();

    const {
      error:
        completeRunError,
    } = await admin
      .from("workflow_runs")
      .update({
        status:
          "succeeded",
        output_data:
          outputData,
        completed_at:
          completedAt,
        error_message:
          null,
      })
      .eq("id", run.id)
      .eq(
        "user_id",
        workflow.user_id
      );

    if (
      completeRunError
    ) {
      throw completeRunError;
    }

    await addLog(
      admin,
      run.id,
      workflow.user_id,
      "success",
      "Scheduled workflow execution completed."
    );

    const nextRun =
      nextRunDate(
        schedule.cron_expression,
        schedule.timezone,
        new Date()
      );

    const {
      error:
        scheduleUpdateError,
    } = await admin
      .from(
        "workflow_schedules"
      )
      .update({
        last_run_at:
          completedAt,

        next_run_at:
          nextRun,

        last_status:
          "succeeded",

        last_error: null,

        locked_until:
          null,
      })
      .eq(
        "id",
        schedule.id
      );

    if (
      scheduleUpdateError
    ) {
      throw scheduleUpdateError;
    }

    return {
      scheduleId:
        schedule.id,
      workflowId:
        workflow.id,
      runId: run.id,
      status:
        "succeeded",
      nextRunAt:
        nextRun,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Scheduled workflow execution failed.";

    console.error(
      "Scheduled workflow error:",
      message
    );

    const completedAt =
      new Date().toISOString();

    if (runId) {
      await admin
        .from(
          "workflow_runs"
        )
        .update({
          status:
            "failed",
          completed_at:
            completedAt,
          error_message:
            message,
        })
        .eq("id", runId)
        .eq(
          "user_id",
          schedule.user_id
        );

      await addLog(
        admin,
        runId,
        schedule.user_id,
        "error",
        message
      );
    }

    let nextRun:
      | string
      | null = null;

    try {
      nextRun =
        nextRunDate(
          schedule.cron_expression,
          schedule.timezone,
          new Date()
        );
    } catch (
      cronError
    ) {
      console.error(
        "Unable to calculate next run:",
        cronError
      );
    }

    await admin
      .from(
        "workflow_schedules"
      )
      .update({
        last_run_at:
          completedAt,

        next_run_at:
          nextRun,

        last_status:
          "failed",

        last_error:
          message,

        locked_until:
          null,

        /*
         * Invalid cron means
         * stop the schedule.
         */
        enabled:
          Boolean(
            nextRun
          ),
      })
      .eq(
        "id",
        schedule.id
      );

    return {
      scheduleId:
        schedule.id,
      runId,
      status: "failed",
      error: message,
      nextRunAt:
        nextRun,
    };
  }
}

export async function POST(
  request: Request
) {
  try {
    const schedulerSecret =
      process.env
        .SCHEDULER_SECRET;

    if (!schedulerSecret) {
      return NextResponse.json(
        {
          error:
            "SCHEDULER_SECRET is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const authorization =
      request.headers.get(
        "authorization"
      );

    if (
      authorization !==
      `Bearer ${schedulerSecret}`
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized scheduler request.",
        },
        {
          status: 401,
        }
      );
    }

    const admin =
      createAdminClient();

    const now =
      new Date().toISOString();

    /*
     * Find schedules that
     * should already have run.
     */
    const {
      data: schedules,
      error:
        schedulesError,
    } = await admin
      .from(
        "workflow_schedules"
      )
      .select(
        `
        id,
        workflow_id,
        user_id,
        enabled,
        cron_expression,
        timezone,
        next_run_at
        `
      )
      .eq(
        "enabled",
        true
      )
      .not(
        "next_run_at",
        "is",
        null
      )
      .lte(
        "next_run_at",
        now
      )
      .order(
        "next_run_at",
        {
          ascending: true,
        }
      )
      .limit(
        MAX_WORKFLOWS_PER_RUN
      );

    if (
      schedulesError
    ) {
      throw schedulesError;
    }

    if (
      !schedules ||
      schedules.length === 0
    ) {
      return NextResponse.json({
        success: true,
        checkedAt:
          now,
        due: 0,
        message:
          "No workflows are due.",
        results: [],
      });
    }

    const results = [];

    /*
     * Sequential execution
     * reduces API spikes.
     */
    for (
      const schedule of schedules
    ) {
      const result =
        await executeSchedule(
          admin,
          schedule
        );

      results.push(
        result
      );
    }

    return NextResponse.json({
      success: true,
      checkedAt:
        now,
      due:
        schedules.length,
      processed:
        results.length,
      results,
    });
  } catch (error) {
    console.error(
      "Scheduler worker error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof
          Error
            ? error.message
            : "Scheduler worker failed.",
      },
      {
        status: 500,
      }
    );
  }
}