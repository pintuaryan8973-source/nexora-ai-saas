import { Bot, Clock3, Layers3, Sparkles, Users, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import AICopilot from "@/components/dashboard/AICopilot";
import CommandCenter from "@/components/dashboard/CommandCenter";
import QuickActions from "@/components/dashboard/QuickActions";
import SmartInsights from "@/components/dashboard/SmartInsights";
import StatCard from "@/components/dashboard/StatCard";
import UsageOverview from "@/components/dashboard/UsageOverview";
import WorkflowCard from "@/components/dashboard/WorkflowCard";
import WorkspaceHealth from "@/components/dashboard/WorkspaceHealth";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const metadata = user?.user_metadata ?? {};
  const name = metadata.full_name || metadata.name || user?.email?.split("@")[0] || "there";
  const firstName = String(name).split(" ")[0];

  return (
    <div className="space-y-5 pb-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-500/[0.07] px-3 py-1 text-[11px] font-medium text-violet-200">
            <Sparkles className="size-3" /> Nexora Intelligence Workspace
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
            Your workspace is healthy. Nexora has completed 23 automated actions and surfaced 3 useful insights since your last visit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-white/45">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,.65)]" />
            All systems operational
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-white/45">
            <Clock3 className="size-3.5" /> Updated just now
          </span>
        </div>
      </div>

      <CommandCenter />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="AI requests"
          value="1,248"
          change="+18.4%"
          detail="vs last week"
          icon={Bot}
          trend={[34, 48, 42, 61, 58, 73, 84]}
        />
        <StatCard
          label="Active workflows"
          value="12"
          change="+3"
          detail="this month"
          icon={Layers3}
          trend={[40, 44, 51, 49, 62, 68, 72]}
        />
        <StatCard
          label="Automations run"
          value="486"
          change="+24.1%"
          detail="vs last week"
          icon={Zap}
          trend={[28, 36, 39, 54, 62, 78, 88]}
        />
        <StatCard
          label="Team members"
          value="4"
          change="+1"
          detail="new member"
          icon={Users}
          trend={[45, 45, 52, 52, 60, 60, 70]}
        />
      </div>

      <QuickActions />

      <div className="grid gap-5 2xl:grid-cols-[1.55fr_.8fr]">
        <div className="space-y-5">
          <UsageOverview />
          <WorkflowCard />
        </div>
        <div className="space-y-5">
          <AICopilot />
          <SmartInsights />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <WorkspaceHealth />
        <ActivityFeed />
      </div>
    </div>
  );
}
