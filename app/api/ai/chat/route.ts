import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RateLimitResult = {
  allowed: boolean;
  reason: string;
  daily_used: number;
  daily_limit: number;
  minute_used: number;
  minute_limit: number;
};

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const supabase = await createClient();

    // -----------------------------------------------------
    // 1. CHECK USER
    // -----------------------------------------------------

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // -----------------------------------------------------
    // 2. READ REQUEST
    // -----------------------------------------------------

    const body = await request.json();

    const message =
      typeof body?.message === "string"
        ? body.message.trim()
        : "";

    const conversationId =
      typeof body?.conversationId === "string"
        ? body.conversationId.trim()
        : "";

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required." },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: "Please enter a message." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 400 }
      );
    }

    // -----------------------------------------------------
    // 3. VERIFY CONVERSATION OWNER
    // -----------------------------------------------------

    const {
      data: conversation,
      error: conversationError,
    } = await supabase
      .from("ai_conversations")
      .select("id, title")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .single();

    if (conversationError || !conversation) {
      return NextResponse.json(
        { error: "Conversation not found." },
        { status: 404 }
      );
    }

    // -----------------------------------------------------
    // 4. RATE LIMIT + DAILY LIMIT CHECK
    // -----------------------------------------------------

    const {
      data: rateData,
      error: rateError,
    } = await supabase.rpc(
      "check_and_register_ai_request",
      {
        p_conversation_id: conversationId,
      }
    );

    if (rateError) {
      console.error("Rate limit error:", rateError);

      return NextResponse.json(
        {
          error:
            "Unable to verify AI usage limit.",
        },
        { status: 500 }
      );
    }

    const limitResult = Array.isArray(rateData)
      ? (rateData[0] as RateLimitResult | undefined)
      : (rateData as RateLimitResult | null);

    if (!limitResult) {
      return NextResponse.json(
        {
          error:
            "Unable to verify AI usage limit.",
        },
        { status: 500 }
      );
    }

    if (!limitResult.allowed) {
      if (limitResult.reason === "daily_limit") {
        return NextResponse.json(
          {
            error:
              `Daily AI limit reached (${limitResult.daily_limit} requests). Try again tomorrow.`,
            code: "DAILY_LIMIT",
            usage: {
              dailyUsed:
                limitResult.daily_used,
              dailyLimit:
                limitResult.daily_limit,
            },
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error:
            `You're sending requests too quickly. Maximum ${limitResult.minute_limit} requests per minute.`,
          code: "RATE_LIMIT",
          usage: {
            minuteUsed:
              limitResult.minute_used,
            minuteLimit:
              limitResult.minute_limit,
          },
        },
        { status: 429 }
      );
    }

    // -----------------------------------------------------
    // 5. SAVE USER MESSAGE
    // -----------------------------------------------------

    const { error: userSaveError } =
      await supabase
        .from("ai_messages")
        .insert({
          user_id: user.id,
          conversation_id:
            conversationId,
          role: "user",
          content: message,
        });

    if (userSaveError) {
      throw userSaveError;
    }

    // -----------------------------------------------------
    // 6. AUTO TITLE NEW CONVERSATION
    // -----------------------------------------------------

    if (
      conversation.title ===
      "New conversation"
    ) {
      const generatedTitle =
        message.length > 55
          ? `${message.slice(0, 55)}...`
          : message;

      await supabase
        .from("ai_conversations")
        .update({
          title: generatedTitle,
        })
        .eq("id", conversationId)
        .eq("user_id", user.id);
    }

    // -----------------------------------------------------
    // 7. LOAD RECENT CHAT CONTEXT
    // -----------------------------------------------------

    const {
      data: recentMessages,
      error: historyError,
    } = await supabase
      .from("ai_messages")
      .select(
        "role, content, created_at"
      )
      .eq(
        "conversation_id",
        conversationId
      )
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(20);

    if (historyError) {
      throw historyError;
    }

    const conversationHistory =
      (recentMessages ?? [])
        .reverse()
        .map((item) => ({
          role: item.role as
            | "user"
            | "assistant",
          content: item.content,
        }));

    // -----------------------------------------------------
    // 8. OPENAI RESPONSE
    // -----------------------------------------------------

    const response =
      await openai.responses.create({
        model: "gpt-5.6-luna",

        instructions: `
You are Nexora AI, a professional intelligent SaaS workspace copilot.

Use the current conversation history to understand context.

Help users:
- create and improve workflows
- plan automations
- summarize work
- brainstorm projects
- manage productivity
- write professional content
- explain technical topics clearly
- improve business operations

Be clear, practical, concise, and professional.
Use Markdown formatting when useful.
Use headings, bullet points, tables, and code blocks when they improve clarity.
Remember relevant details from the current conversation.
Never claim an action was completed unless it actually was.
        `.trim(),

        input: conversationHistory,
      });

    const answer =
      response.output_text?.trim() ||
      "I could not generate a response.";

    // -----------------------------------------------------
    // 9. SAVE AI RESPONSE
    // -----------------------------------------------------

    const {
      error: assistantSaveError,
    } = await supabase
      .from("ai_messages")
      .insert({
        user_id: user.id,
        conversation_id:
          conversationId,
        role: "assistant",
        content: answer,
      });

    if (assistantSaveError) {
      throw assistantSaveError;
    }

    // -----------------------------------------------------
    // 10. SAVE TOKEN USAGE
    // -----------------------------------------------------

    const inputTokens =
      response.usage?.input_tokens ?? 0;

    const outputTokens =
      response.usage?.output_tokens ?? 0;

    const totalTokens =
      response.usage?.total_tokens ?? 0;

    const { error: usageError } =
      await supabase.rpc(
        "record_ai_usage",
        {
          p_input_tokens:
            inputTokens,
          p_output_tokens:
            outputTokens,
          p_total_tokens:
            totalTokens,
        }
      );

    if (usageError) {
      // AI answer should still succeed even if analytics logging fails.
      console.error(
        "AI usage logging error:",
        usageError
      );
    }

    // -----------------------------------------------------
    // 11. RETURN RESPONSE
    // -----------------------------------------------------

    return NextResponse.json({
      success: true,
      answer,

      usage: {
        dailyUsed:
          limitResult.daily_used,
        dailyLimit:
          limitResult.daily_limit,
        inputTokens,
        outputTokens,
        totalTokens,
      },
    });
  } catch (error) {
    console.error(
      "Nexora AI error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Nexora AI is temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}