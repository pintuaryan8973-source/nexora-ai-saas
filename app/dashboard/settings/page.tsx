import { Settings } from "lucide-react";
import ModulePage from "@/components/dashboard/ModulePage";

export default function SettingsPage() {
  return (
    <ModulePage eyebrow="Account & workspace" title="Settings" description="Manage your profile, workspace preferences, notifications, and security." icon={Settings}>
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-white/[0.08] bg-[#0c0c13] p-5">
          <h2 className="font-semibold">Workspace profile</h2>
          <div className="mt-5 space-y-4">
            <label className="block"><span className="mb-2 block text-xs text-white/35">Workspace name</span><input defaultValue="Nexora HQ" className="h-11 w-full rounded-xl border border-white/[0.08] bg-black/20 px-3 text-sm outline-none focus:border-violet-400/30" /></label>
            <label className="block"><span className="mb-2 block text-xs text-white/35">Workspace URL</span><input defaultValue="nexora-hq" className="h-11 w-full rounded-xl border border-white/[0.08] bg-black/20 px-3 text-sm outline-none focus:border-violet-400/30" /></label>
            <button className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black">Save changes</button>
          </div>
        </section>
        <section className="rounded-2xl border border-white/[0.08] bg-[#0c0c13] p-5">
          <h2 className="font-semibold">Notifications</h2>
          <div className="mt-5 space-y-4">
            {["Workflow failures", "Weekly workspace summary", "New team activity"].map((label, index) => (
              <label key={label} className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white/60"><span>{label}</span><input type="checkbox" defaultChecked={index < 2} className="size-4 accent-violet-500" /></label>
            ))}
          </div>
        </section>
      </div>
    </ModulePage>
  );
}
