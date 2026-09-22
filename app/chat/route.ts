import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 }
      );
    }

    const supabase = await createClient();

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

    const body = await request.json();

    const message =
      typeof body?.message === "string"
        ? body.message.trim()
        : "";

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

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      instructions: `
You are Nexora AI, an intelligent SaaS workspace copilot.

Your job is to help users:
- create and improve workflows
- plan automations
- summarize work
- brainstorm projects
- analyze productivity
- write professional content
- explain technical topics clearly
- help with business and team operations

Be helpful, concise, practical, and professional.
Use clear steps when useful.
Do not pretend an action was completed unless it actually was.
      `.trim(),

      input: message,
    });

    const answer =
      response.output_text?.trim() ||
      "I could not generate a response.";

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("Nexora AI error:", error);

    return NextResponse.json(
      {
        error:
          "Nexora AI is temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}