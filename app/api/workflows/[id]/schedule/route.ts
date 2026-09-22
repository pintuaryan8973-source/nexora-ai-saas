import { NextResponse } from "next/server";
import { CronExpressionParser } from "cron-parser";

import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getNextRun(
  cronExpression: string,
  timezone: string
) {
  const expression =
    CronExpressionParser.parse(
      cronExpression,
      {
        currentDate: new Date(),
        tz: timezone,
      }
    );

  return expression
    .next()
    .toDate()
    .toISOString();
}

// ==========================================
// GET CURRENT SCHEDULE
// ==========================================

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id: workflowId } =
      await context.params;

    const supabase =
      await createClient();

    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: workflow,
      error: workflowError,
    } = await supabase
      .from("workflows")
      .select(
        `
        id,
        name,
        trigger_type,
        status
        `
      )
      .eq("id", workflowId)
      .eq("user_id", user.id)
      .single();

    if (
      workflowError ||
      !workflow
    ) {
      return NextResponse.json(
        {
          error:
            "Workflow not found.",
        },
        {
          status: 404,
        }
      );
    }

    const {
      data: schedule,
      error: scheduleError,
    } = await supabase
      .from(
        "workflow_schedules"
      )
      .select(
        `
        id,
        workflow_id,
        enabled,
        cron_expression,
        timezone,
        next_run_at,
        last_run_at,
        last_status,
        last_error,
        created_at,
        updated_at
        `
      )
      .eq(
        "workflow_id",
        workflowId
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (scheduleError) {
      throw scheduleError;
    }

    return NextResponse.json({
      success: true,
      workflow,
      schedule:
        schedule ?? null,
    });
  } catch (error) {
    console.error(
      "Schedule GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load schedule.",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// CREATE / UPDATE SCHEDULE
// ==========================================

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id: workflowId } =
      await context.params;

    const supabase =
      await createClient();

    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: workflow,
      error: workflowError,
    } = await supabase
      .from("workflows")
      .select(
        `
        id,
        name,
        trigger_type,
        status
        `
      )
      .eq("id", workflowId)
      .eq("user_id", user.id)
      .single();

    if (
      workflowError ||
      !workflow
    ) {
      return NextResponse.json(
        {
          error:
            "Workflow not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      workflow.trigger_type !==
      "schedule"
    ) {
      return NextResponse.json(
        {
          error:
            "This workflow does not use the Schedule trigger.",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await request.json();

    const cronExpression =
      typeof body.cronExpression ===
      "string"
        ? body.cronExpression.trim()
        : "";

    const timezone =
      typeof body.timezone ===
        "string" &&
      body.timezone.trim()
        ? body.timezone.trim()
        : "Asia/Kolkata";

    const enabled =
      body.enabled !== false;

    if (!cronExpression) {
      return NextResponse.json(
        {
          error:
            "Cron expression is required.",
        },
        {
          status: 400,
        }
      );
    }

    let nextRunAt:
      | string
      | null = null;

    if (enabled) {
      try {
        nextRunAt =
          getNextRun(
            cronExpression,
            timezone
          );
      } catch {
        return NextResponse.json(
          {
            error:
              "Invalid schedule or timezone.",
          },
          {
            status: 400,
          }
        );
      }
    }

    const {
      data: schedule,
      error: saveError,
    } = await supabase
      .from(
        "workflow_schedules"
      )
      .upsert(
        {
          workflow_id:
            workflowId,

          user_id:
            user.id,

          enabled,

          cron_expression:
            cronExpression,

          timezone,

          next_run_at:
            nextRunAt,

          locked_until:
            null,

          last_error:
            null,
        },
        {
          onConflict:
            "workflow_id",
        }
      )
      .select(
        `
        id,
        workflow_id,
        enabled,
        cron_expression,
        timezone,
        next_run_at,
        last_run_at,
        last_status,
        last_error,
        created_at,
        updated_at
        `
      )
      .single();

    if (saveError) {
      throw saveError;
    }

    return NextResponse.json({
      success: true,
      schedule,
    });
  } catch (error) {
    console.error(
      "Schedule PUT error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save schedule.",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// REMOVE SCHEDULE
// ==========================================

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id: workflowId } =
      await context.params;

    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { error } =
      await supabase
        .from(
          "workflow_schedules"
        )
        .delete()
        .eq(
          "workflow_id",
          workflowId
        )
        .eq(
          "user_id",
          user.id
        );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Schedule DELETE error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete schedule.",
      },
      {
        status: 500,
      }
    );
  }
}