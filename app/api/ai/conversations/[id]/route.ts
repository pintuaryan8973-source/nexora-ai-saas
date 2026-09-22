import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// Load one conversation + its messages
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

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

    const { data: conversation, error: conversationError } =
      await supabase
        .from("ai_conversations")
        .select("id, title, created_at, updated_at")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (conversationError || !conversation) {
      return NextResponse.json(
        { error: "Conversation not found." },
        { status: 404 }
      );
    }

    const { data: messages, error: messagesError } =
      await supabase
        .from("ai_messages")
        .select("id, role, content, created_at")
        .eq("conversation_id", id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(200);

    if (messagesError) {
      throw messagesError;
    }

    return NextResponse.json({
      conversation,
      messages: messages ?? [],
    });
  } catch (error) {
    console.error("Conversation load error:", error);

    return NextResponse.json(
      { error: "Unable to load conversation." },
      { status: 500 }
    );
  }
}

// Rename conversation
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

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

    const body = await request.json();

    const title =
      typeof body?.title === "string"
        ? body.title.trim()
        : "";

    if (!title) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 }
      );
    }

    if (title.length > 120) {
      return NextResponse.json(
        { error: "Title is too long." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("ai_conversations")
      .update({
        title,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id, title, created_at, updated_at")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      conversation: data,
    });
  } catch (error) {
    console.error("Conversation rename error:", error);

    return NextResponse.json(
      { error: "Unable to rename conversation." },
      { status: 500 }
    );
  }
}

// Delete conversation
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

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

    const { error } = await supabase
      .from("ai_conversations")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Conversation delete error:", error);

    return NextResponse.json(
      { error: "Unable to delete conversation." },
      { status: 500 }
    );
  }
}