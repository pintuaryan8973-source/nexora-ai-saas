"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  WorkflowActionType,
  WorkflowStatus,
  WorkflowTriggerType,
} from "@/lib/workflows";

export type WorkflowActionResult = {
  ok: boolean;
  error?: string;
};

const triggerTypes = new Set<WorkflowTriggerType>([
  "manual",
  "schedule",
  "form",
  "email",
  "calendar",
  "webhook",
]);

const actionTypes = new Set<WorkflowActionType>([
  "ai_task",
  "email",
  "notification",
  "webhook",
  "database",
]);

const statuses = new Set<WorkflowStatus>(["active", "paused", "draft"]);

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function friendlyError(error: { code?: string | null; message?: string | null }) {
  if (error.code === "42P01") {
    return "Workflow database table is missing. Run the supplied Supabase SQL setup first.";
  }

  if (error.code === "42501") {
    return "Supabase blocked this request. Check that Row Level Security policies were created from the supplied SQL.";
  }

  return error.message || "Something went wrong. Please try again.";
}

async function authenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { supabase, user: null };
  }

  return { supabase, user: data.user };
}

function refreshWorkflowViews() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/workflows");
}

export async function createWorkflow(formData: FormData): Promise<WorkflowActionResult> {
  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, error: "Your session expired. Please sign in again." };
  }

  const name = text(formData, "name");
  const description = text(formData, "description");
  const triggerType = text(formData, "trigger_type") as WorkflowTriggerType;
  const actionType = text(formData, "action_type") as WorkflowActionType;
  const status = text(formData, "status") as WorkflowStatus;

  if (name.length < 2 || name.length > 120) {
    return { ok: false, error: "Workflow name must be between 2 and 120 characters." };
  }

  if (description.length > 600) {
    return { ok: false, error: "Description must be 600 characters or less." };
  }

  if (!triggerTypes.has(triggerType)) {
    return { ok: false, error: "Choose a valid trigger." };
  }

  if (!actionTypes.has(actionType)) {
    return { ok: false, error: "Choose a valid action." };
  }

  if (!statuses.has(status)) {
    return { ok: false, error: "Choose a valid status." };
  }

  const { error } = await supabase.from("workflows").insert({
    user_id: user.id,
    name,
    description,
    trigger_type: triggerType,
    action_type: actionType,
    status,
  });

  if (error) {
    return { ok: false, error: friendlyError(error) };
  }

  refreshWorkflowViews();
  return { ok: true };
}

export async function setWorkflowStatus(
  workflowId: string,
  nextStatus: WorkflowStatus,
): Promise<WorkflowActionResult> {
  if (!statuses.has(nextStatus)) {
    return { ok: false, error: "Invalid workflow status." };
  }

  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, error: "Your session expired. Please sign in again." };
  }

  const { error } = await supabase
    .from("workflows")
    .update({ status: nextStatus })
    .eq("id", workflowId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, error: friendlyError(error) };
  }

  refreshWorkflowViews();
  return { ok: true };
}

export async function deleteWorkflow(workflowId: string): Promise<WorkflowActionResult> {
  const { supabase, user } = await authenticatedClient();

  if (!user) {
    return { ok: false, error: "Your session expired. Please sign in again." };
  }

  const { error } = await supabase
    .from("workflows")
    .delete()
    .eq("id", workflowId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, error: friendlyError(error) };
  }

  refreshWorkflowViews();
  return { ok: true };
}
