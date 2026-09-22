import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const today = new Date()
      .toISOString()
      .slice(0, 10);

    // User plan + limits
    const {
      data: limits,
      error: limitsError,
    } = await supabase
      .from("ai_user_limits")
      .select(
        "plan, daily_request_limit, per_minute_limit"
      )
      .eq("user_id", user.id)
      .single();

    if (limitsError) {
      throw limitsError;
    }

    // Successful AI usage today
    const {
      data: usage,
      error: usageError,
    } = await supabase
      .from("ai_usage_daily")
      .select(
        "request_count, input_tokens, output_tokens, total_tokens"
      )
      .eq("user_id", user.id)
      .eq("usage_date", today)
      .maybeSingle();

    if (usageError) {
      throw usageError;
    }

    // All requests counted toward daily limit
    const {
      count: requestsToday,
      error: requestLogError,
    } = await supabase
      .from("ai_request_log")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id)
      .eq("usage_date", today);

    if (requestLogError) {
      throw requestLogError;
    }

    const dailyLimit =
      limits.daily_request_limit;

    const used =
      requestsToday ?? 0;

    const remaining =
      Math.max(dailyLimit - used, 0);

    return NextResponse.json({
      success: true,

      plan: limits.plan,

      limits: {
        daily: dailyLimit,
        perMinute:
          limits.per_minute_limit,
      },

      usage: {
        requestsToday: used,
        successfulRequests:
          usage?.request_count ?? 0,

        inputTokens:
          Number(
            usage?.input_tokens ?? 0
          ),

        outputTokens:
          Number(
            usage?.output_tokens ?? 0
          ),

        totalTokens:
          Number(
            usage?.total_tokens ?? 0
          ),

        remaining,
      },
    });
  } catch (error) {
    console.error(
      "AI usage API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load AI usage.",
      },
      { status: 500 }
    );
  }
}