import OpenAI from "openai";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type SupabaseClient = Awaited<
  ReturnType<typeof createClient>
>;

async function addLog(
  supabase: SupabaseClient,
  runId: string | null,
  userId: string | null,
  level: "info" | "success" | "warning" | "error",
  message: string,
  metadata: Record<string, unknown> = {}
) {
  if (!runId || !userId) {
    return;
  }

  const { error } = await supabase
    .from("workflow_run_logs")
    .insert({
      run_id: runId,
      user_id: userId,
      level,
      message,
      metadata,
    });

  if (error) {
    console.error("Workflow log error:", error);
  }
}

// ======================================================
// GET WORKFLOW RUN HISTORY
// ======================================================

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id: workflowId } = await context.params;

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

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
      .select("id,name")
      .eq("id", workflowId)
      .eq("user_id", user.id)
      .single();

    if (workflowError || !workflow) {
      return NextResponse.json(
        {
          error: "Workflow not found.",
        },
        {
          status: 404,
        }
      );
    }

    const {
      data: runs,
      error: runsError,
    } = await supabase
      .from("workflow_runs")
      .select(
        `
        id,
        workflow_id,
        status,
        trigger_source,
        input_data,
        output_data,
        error_message,
        started_at,
        completed_at,
        duration_ms,
        created_at
        `
      )
      .eq("workflow_id", workflowId)
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(20);

    if (runsError) {
      throw runsError;
    }

    const runIds =
      (runs ?? []).map((run) => run.id);

    let logs: Array<{
      id: number;
      run_id: string;
      level: "info" | "success" | "warning" | "error";
      message: string;
      metadata: Record<string, unknown>;
      created_at: string;
    }> = [];

    if (runIds.length > 0) {
      const {
        data: logData,
        error: logError,
      } = await supabase
        .from("workflow_run_logs")
        .select(
          `
          id,
          run_id,
          level,
          message,
          metadata,
          created_at
          `
        )
        .eq("user_id", user.id)
        .in("run_id", runIds)
        .order("created_at", {
          ascending: true,
        });

      if (logError) {
        throw logError;
      }

      logs =
        (logData ?? []) as typeof logs;
    }

    const runsWithLogs =
      (runs ?? []).map((run) => ({
        ...run,

        logs: logs.filter(
          (log) => log.run_id === run.id
        ),
      }));

    return NextResponse.json({
      success: true,
      workflow,
      runs: runsWithLogs,
    });
  } catch (error) {
    console.error(
      "Workflow history error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load workflow history.",
      },
      {
        status: 500,
      }
    );
  }
}

// ======================================================
// EXECUTE WORKFLOW
// ======================================================

export async function POST(
  request: Request,
  context: RouteContext
) {
  const { id: workflowId } =
    await context.params;

  const supabase =
    await createClient();

  let runId: string | null =
    null;

  let currentUserId:
    | string
    | null = null;

  try {
    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized. Please sign in.",
        },
        {
          status: 401,
        }
      );
    }

    currentUserId = user.id;

    const {
      data: workflow,
      error: workflowError,
    } = await supabase
      .from("workflows")
      .select(
        `
        id,
        name,
        description,
        trigger_type,
        action_type,
        status,
        config
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
      workflow.status !==
      "active"
    ) {
      return NextResponse.json(
        {
          error:
            "Activate this workflow before running it.",
        },
        {
          status: 400,
        }
      );
    }

    let inputData: Record<
      string,
      unknown
    > = {};

    try {
      const body =
        await request.json();

      if (
        body?.input &&
        typeof body.input ===
          "object" &&
        !Array.isArray(
          body.input
        )
      ) {
        inputData =
          body.input;
      }
    } catch {
      // Request body can be empty.
    }

    // ==================================================
    // CREATE RUN
    // ==================================================

    const {
      data: run,
      error:
        runCreateError,
    } = await supabase
      .from("workflow_runs")
      .insert({
        workflow_id:
          workflow.id,

        user_id:
          user.id,

        status:
          "queued",

        trigger_source:
          "manual",

        input_data:
          inputData,
      })
      .select("id")
      .single();

    if (
      runCreateError ||
      !run
    ) {
      throw (
        runCreateError ??
        new Error(
          "Unable to create workflow run."
        )
      );
    }

    runId = run.id;

    await addLog(
      supabase,
      runId,
      user.id,
      "info",
      "Workflow run created."
    );

    // ==================================================
    // MARK RUNNING
    // ==================================================

    const startedAt =
      new Date().toISOString();

    const {
      error: startError,
    } = await supabase
      .from("workflow_runs")
      .update({
        status:
          "running",

        started_at:
          startedAt,
      })
      .eq("id", run.id)
      .eq(
        "user_id",
        user.id
      );

    if (startError) {
      throw startError;
    }

    await addLog(
      supabase,
      runId,
      user.id,
      "info",
      `Executing ${workflow.action_type} action.`
    );

    let outputData: Record<
      string,
      unknown
    > = {};

    // ==================================================
    // AI TASK
    // ==================================================

    if (
      workflow.action_type ===
      "ai_task"
    ) {
      if (
        !process.env
          .OPENAI_API_KEY
      ) {
        throw new Error(
          "OpenAI API key is not configured."
        );
      }

      const openai =
        new OpenAI({
          apiKey:
            process.env
              .OPENAI_API_KEY,
        });

      await addLog(
        supabase,
        runId,
        user.id,
        "info",
        "Sending task to Nexora AI."
      );

      const response =
        await openai.responses.create({
          model:
            "gpt-5.6-luna",

          instructions: `
You are the Nexora AI Workflow Execution Engine.

Execute the workflow task using the workflow name, description, configuration and run input.

Use all information supplied in RUN INPUT.

If the user supplied client, project, task, reporting, issue, goal or status information, use that information directly in the result.

Return a useful and professional result.

Use Markdown formatting when helpful.

Do not claim that an external action was completed unless that integration is actually connected.
          `.trim(),

          input: `
WORKFLOW NAME:
${workflow.name}

DESCRIPTION:
${
  workflow.description ||
  "No description provided."
}

CONFIGURATION:
${JSON.stringify(
  workflow.config ?? {},
  null,
  2
)}

RUN INPUT:
${JSON.stringify(
  inputData,
  null,
  2
)}
          `.trim(),
        });

      const result =
        response.output_text?.trim() ||
        "Workflow completed without text output.";

      outputData = {
        actionType:
          "ai_task",

        result,

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
        supabase,
        runId,
        user.id,
        "success",
        "Nexora AI task completed successfully."
      );
    } else {
      throw new Error(
        `${workflow.action_type} integration is not configured yet.`
      );
    }

    // ==================================================
    // SUCCESS
    // ==================================================

    const completedAt =
      new Date().toISOString();

    const {
      error:
        successUpdateError,
    } = await supabase
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
      .eq(
        "id",
        run.id
      )
      .eq(
        "user_id",
        user.id
      );

    if (
      successUpdateError
    ) {
      throw successUpdateError;
    }

    await addLog(
      supabase,
      runId,
      user.id,
      "success",
      "Workflow execution completed."
    );

    return NextResponse.json({
      success: true,
      runId,
      status:
        "succeeded",
      output:
        outputData,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Workflow execution failed.";

    console.error(
      "Workflow execution error:",
      error
    );

    if (
      runId &&
      currentUserId
    ) {
      const completedAt =
        new Date().toISOString();

      await supabase
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
          currentUserId
        );

      await addLog(
        supabase,
        runId,
        currentUserId,
        "error",
        message
      );
    }

    return NextResponse.json(
      {
        success: false,
        runId,
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}