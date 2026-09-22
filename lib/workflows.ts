export type WorkflowStatus = "active" | "paused" | "draft";
export type WorkflowTriggerType =
  | "manual"
  | "schedule"
  | "form"
  | "email"
  | "calendar"
  | "webhook";
export type WorkflowActionType =
  | "ai_task"
  | "email"
  | "notification"
  | "webhook"
  | "database";

export type WorkflowRecord = {
  id: string;
  name: string;
  description: string;
  trigger_type: WorkflowTriggerType;
  action_type: WorkflowActionType;
  status: WorkflowStatus;
  run_count: number;
  last_run_at: string | null;
  created_at: string;
  updated_at: string;
};

export const workflowTriggers: Array<{
  value: WorkflowTriggerType;
  label: string;
  description: string;
}> = [
  { value: "manual", label: "Manual", description: "Start it yourself whenever you need it." },
  { value: "schedule", label: "Schedule", description: "Run on a recurring time or date." },
  { value: "form", label: "Form submitted", description: "Start when a new form response arrives." },
  { value: "email", label: "Email received", description: "Start when a matching email arrives." },
  { value: "calendar", label: "Calendar event", description: "Start when a calendar event changes." },
  { value: "webhook", label: "Webhook", description: "Start from an external HTTP event." },
];

export const workflowActions: Array<{
  value: WorkflowActionType;
  label: string;
  description: string;
}> = [
  { value: "ai_task", label: "AI task", description: "Send work to the Nexora AI copilot." },
  { value: "email", label: "Send email", description: "Prepare an email action for a future connector." },
  { value: "notification", label: "Notification", description: "Create a workspace notification." },
  { value: "webhook", label: "Webhook", description: "Call another service over HTTP." },
  { value: "database", label: "Database action", description: "Create or update data in a connected source." },
];

export const workflowStatuses: Array<{ value: WorkflowStatus; label: string }> = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "draft", label: "Draft" },
];

export function triggerLabel(value: WorkflowTriggerType) {
  return workflowTriggers.find((item) => item.value === value)?.label ?? value;
}

export function actionLabel(value: WorkflowActionType) {
  return workflowActions.find((item) => item.value === value)?.label ?? value;
}

export function statusLabel(value: WorkflowStatus) {
  return workflowStatuses.find((item) => item.value === value)?.label ?? value;
}
