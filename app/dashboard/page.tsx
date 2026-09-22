import {
  Bot,
  Clock3,
  Layers3,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import type { WorkflowRecord } from "@/lib/workflows";

import ActivityFeed from "@/components/dashboard/ActivityFeed";
import AICopilot from "@/components/dashboard/AICopilot";
import AIUsageCard from "@/components/dashboard/AIUsageCard";
import CommandCenter from "@/components/dashboard/CommandCenter";
import QuickActions from "@/components/dashboard/QuickActions";
import SmartInsights from "@/components/dashboard/SmartInsights";
import StatCard from "@/components/dashboard/StatCard";
import UsageOverview from "@/components/dashboard/UsageOverview";
import WorkflowCard from "@/components/dashboard/WorkflowCard";
import WorkspaceHealth from "@/components/dashboard/WorkspaceHealth";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const metadata = user?.user_metadata ?? {};

  const name =
    metadata.full_name ||
    metadata.name ||
    user?.email?.split("@")[0] ||
    "there";

  const firstName = String(name).split(" ")[0];

  let activeWorkflowCount = 0;
  let totalWorkflowCount = 0;
  let trackedRuns = 0;

  let aiRequestsToday = 0;
  let aiSuccessfulRequests = 0;
  let aiTokensToday = 0;

  let recentWorkflows: WorkflowRecord[] = [];

  if (user) {
    const today = new Date()
      .toISOString()
      .slice(0, 10);

    const [
      activeResult,
      totalResult,
      runsResult,
      recentResult,
      aiRequestsResult,
      aiUsageResult,
    ] = await Promise.all([
      // Active workflows
      supabase
        .from("workflows")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("status", "active"),

      // Total workflows
      supabase
        .from("workflows")
        .select("id", {
          count: "exact",
          head: true,
        }),

      // Workflow runs
      supabase
        .from("workflows")
        .select("run_count"),

      // Recent workflows
      supabase
        .from("workflows")
        .select(
          `
          id,
          name,
          description,
          trigger_type,
          action_type,
          status,
          run_count,
          last_run_at,
          created_at,
          updated_at
          `,
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(3),

      // Real AI requests today
      supabase
        .from("ai_request_log")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("usage_date", today),

      // Real AI token usage today
      supabase
        .from("ai_usage_daily")
        .select(
          `
          request_count,
          input_tokens,
          output_tokens,
          total_tokens
          `,
        )
        .eq("usage_date", today)
        .maybeSingle(),
    ]);

    activeWorkflowCount =
      activeResult.count ?? 0;

    totalWorkflowCount =
      totalResult.count ?? 0;

    trackedRuns = (
      runsResult.data ?? []
    ).reduce(
      (sum, item) =>
        sum +
        Number(item.run_count ?? 0),
      0,
    );

    recentWorkflows =
      (recentResult.data ??
        []) as WorkflowRecord[];

    aiRequestsToday =
      aiRequestsResult.count ?? 0;

    aiSuccessfulRequests =
      Number(
        aiUsageResult.data
          ?.request_count ?? 0,
      );

    aiTokensToday =
      Number(
        aiUsageResult.data
          ?.total_tokens ?? 0,
      );
  }

  return (
    <div className="space-y-5 pb-4">
      {/* HEADER */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-500/[0.07] px-3 py-1 text-[11px] font-medium text-violet-200">
            <Sparkles className="size-3" />
            Nexora Intelligence Workspace
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Welcome back, {firstName}.
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
            Your intelligent workspace is live.
            Build workflows, use Nexora AI,
            monitor usage, and manage your
            automation workspace from one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-white/45">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,.65)]" />
            Supabase connected
          </span>

          <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-white/45">
            <Bot className="size-3.5" />
            Nexora AI live
          </span>

          <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-white/45">
            <Clock3 className="size-3.5" />
            Live account data
          </span>
        </div>
      </div>

      {/* COMMAND CENTER */}
      <CommandCenter
        activeWorkflows={
          activeWorkflowCount
        }
        savedWorkflows={
          totalWorkflowCount
        }
        trackedRuns={trackedRuns}
      />

      {/* REAL STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="AI requests"
          value={aiRequestsToday.toLocaleString()}
          change="Today"
          detail={`${aiTokensToday.toLocaleString()} tokens used`}
          icon={Bot}
          trend={[
            18,
            24,
            31,
            38,
            48,
            61,
            aiRequestsToday > 0
              ? 82
              : 12,
          ]}
        />

        <StatCard
          label="Active workflows"
          value={activeWorkflowCount.toLocaleString()}
          change={`${totalWorkflowCount}`}
          detail="saved workflows"
          icon={Layers3}
          trend={[
            28,
            34,
            42,
            51,
            58,
            68,
            activeWorkflowCount > 0
              ? 82
              : 12,
          ]}
        />

        <StatCard
          label="Automation runs"
          value={trackedRuns.toLocaleString()}
          change="Live"
          detail="tracked in database"
          icon={Zap}
          trend={[
            14,
            18,
            22,
            28,
            32,
            38,
            trackedRuns > 0
              ? 72
              : 12,
          ]}
        />

        <StatCard
          label="AI success"
          value={aiSuccessfulRequests.toLocaleString()}
          change="Today"
          detail="successful AI responses"
          icon={Users}
          trend={[
            22,
            28,
            35,
            42,
            50,
            63,
            aiSuccessfulRequests > 0
              ? 86
              : 12,
          ]}
        />
      </div>

      {/* QUICK ACTIONS */}
      <QuickActions />

      {/* MAIN DATA AREA */}
      <div className="grid gap-5 2xl:grid-cols-[1.55fr_.8fr]">
        <div className="space-y-5">
          <UsageOverview />

          <WorkflowCard
            workflows={recentWorkflows}
          />
        </div>

        <div className="space-y-5">
          {/* REAL AI USAGE */}
          <AIUsageCard />

          <AICopilot />

          <SmartInsights />
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <WorkspaceHealth />

        <ActivityFeed />
      </div>
    </div>
  );
}