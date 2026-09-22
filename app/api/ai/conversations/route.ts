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

    const { data, error } = await supabase
      .from("ai_conversations")
      .select("id, title, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      conversations: data ?? [],
    });
  } catch (error) {
    console.error("Conversation list error:", error);

    return NextResponse.json(
      { error: "Unable to load conversations." },
      { status: 500 }
    );
  }
}

export async function POST() {
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

    const { data, error } = await supabase
      .from("ai_conversations")
      .insert({
        user_id: user.id,
        title: "New conversation",
      })
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
    console.error("Conversation create error:", error);

    return NextResponse.json(
      { error: "Unable to create conversation." },
      { status: 500 }
    );
  }
}