import { Workflow } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { WorkflowRecord } from "@/lib/workflows";
import WorkflowManager from "@/components/dashboard/workflows/WorkflowManager";

export default async function WorkflowsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  let workflows: WorkflowRecord[] = [];
  let setupError = "";

  if (user) {
    const { data, error } = await supabase
      .from("workflows")
      .select(
        "id,name,description,trigger_type,action_type,status,run_count,last_run_at,created_at,updated_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      setupError =
        error.code === "42P01"
          ? "The workflows table has not been created yet. Run the supplied SQL in Supabase, then refresh this page."
          : error.message;
    } else {
      workflows = (data ?? []) as WorkflowRecord[];
    }
  }

  return (
    <div className="space-y-7 pb-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-violet-300">
            <Workflow className="size-4" /> Automation builder
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Workflows
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
            Create reusable automations, keep them private to your account, and manage their status from one place.
          </p>
        </div>
      </div>

      <WorkflowManager
        initialWorkflows={workflows}
        initialOpen={params.new === "1"}
        setupError={setupError}
      />
    </div>
  );
}
