"use client";

import { useEffect, useState } from "react";

type UsageData = {
  plan: string;

  limits: {
    daily: number;
    perMinute: number;
  };

  usage: {
    requestsToday: number;
    successfulRequests: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    remaining: number;
  };
};

export default function AIUsageCard() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsage();
  }, []);

  async function loadUsage() {
    try {
      setLoading(true);

      const response = await fetch("/api/ai/usage", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to load usage."
        );
      }

      setData(result);
    } catch (error) {
      console.error("AI usage load error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm text-white/40">
          Loading AI usage...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm text-white/40">
          AI usage unavailable.
        </p>
      </div>
    );
  }

  const used = data.usage.requestsToday;
  const limit = data.limits.daily;

  const percentage =
    limit > 0
      ? Math.min((used / limit) * 100, 100)
      : 0;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white/40">
            AI Usage
          </p>

          <h3 className="mt-1 text-xl font-semibold text-white">
            {used} / {limit}
          </h3>
        </div>

        <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/60">
          {data.plan}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-white/40">
          <span>Daily requests</span>
          <span>
            {data.usage.remaining} remaining
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stat
          label="Successful"
          value={data.usage.successfulRequests}
        />

        <Stat
          label="Per minute"
          value={data.limits.perMinute}
        />

        <Stat
          label="Input tokens"
          value={data.usage.inputTokens.toLocaleString()}
        />

        <Stat
          label="Output tokens"
          value={data.usage.outputTokens.toLocaleString()}
        />
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
        <p className="text-xs text-white/40">
          Total tokens used today
        </p>

        <p className="mt-1 text-lg font-semibold text-white">
          {data.usage.totalTokens.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-white/40">
        {label}
      </p>

      <p className="mt-1 text-base font-semibold text-white">
        {value}
      </p>
    </div>
  );
}