import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: "Gemini API key is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized. Please sign in.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const message =
      typeof body?.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        {
          error: "Please enter a message.",
        },
        {
          status: 400,
        }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          error: "Message is too long.",
        },
        {
          status: 400,
        }
      );
    }

    const prompt = `
You are Nexora AI, an intelligent SaaS workspace copilot.

Your job is to help users:
- create workflows
- improve workflows
- automate tasks
- summarize work
- explain technical topics
- brainstorm ideas
- help with productivity
- answer professionally

User message:

${message}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const answer =
      result.text ??
      "I could not generate a response.";

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Nexora AI is temporarily unavailable.",
      },
      {
        status: 500,
      }
    );
  }
}