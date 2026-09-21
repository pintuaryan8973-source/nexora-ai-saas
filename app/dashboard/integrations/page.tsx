import { Check, Github, Mail, Plug, Slack } from "lucide-react";
import ModulePage from "@/components/dashboard/ModulePage";

const integrations = [
  { name: "Gmail", icon: Mail, description: "Use messages as triggers and draft contextual replies.", connected: true },
  { name: "GitHub", icon: Github, description: "Track repositories, issues, and engineering activity.", connected: false },
  { name: "Slack", icon: Slack, description: "Send alerts and turn conversations into actions.", connected: false },
  { name: "Google Drive", icon: Plug, description: "Bring documents and files into workspace context.", connected: true },
];

export default function IntegrationsPage() {
  return (
    <ModulePage eyebrow="Connected workspace" title="Integrations" description="Bring your existing tools into Nexora so workflows can understand and act across them." icon={Plug}>
      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map(({ name, icon: Icon, description, connected }) => (
          <article key={name} className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-[#0c0c13] p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-white/65"><Icon className="size-5" /></span>
            <div className="min-w-0 flex-1"><h2 className="font-semibold">{name}</h2><p className="mt-2 text-sm leading-6 text-white/35">{description}</p></div>
            <button className={connected ? "flex items-center gap-1 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs text-emerald-300" : "rounded-lg border border-white/[0.09] px-3 py-2 text-xs text-white/55 hover:bg-white/[0.05]"}>{connected ? <><Check className="size-3" /> Connected</> : "Connect"}</button>
          </article>
        ))}
      </div>
    </ModulePage>
  );
}
