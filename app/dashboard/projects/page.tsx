import { FolderKanban, MoreHorizontal, Plus } from "lucide-react";
import ModulePage from "@/components/dashboard/ModulePage";

const projects = [
  { name: "Nexora launch", progress: 78, tasks: "18 / 23 tasks", members: 4 },
  { name: "Client onboarding", progress: 56, tasks: "9 / 16 tasks", members: 3 },
  { name: "AI knowledge base", progress: 34, tasks: "7 / 21 tasks", members: 2 },
];

export default function ProjectsPage() {
  return (
    <ModulePage eyebrow="Organize execution" title="Projects" description="Keep goals, tasks, people, and AI-assisted work moving in one place." icon={FolderKanban}>
      <div className="flex justify-end"><button className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black"><Plus className="size-4" /> New project</button></div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {projects.map((project) => (
          <article key={project.name} className="rounded-2xl border border-white/[0.08] bg-[#0c0c13] p-5">
            <div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-cyan-500/10 text-cyan-300"><FolderKanban className="size-4" /></span><MoreHorizontal className="size-4 text-white/25" /></div>
            <h2 className="mt-5 font-semibold">{project.name}</h2>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-violet-400" style={{ width: `${project.progress}%` }} /></div>
            <div className="mt-3 flex justify-between text-xs text-white/30"><span>{project.tasks}</span><span>{project.progress}%</span></div>
            <p className="mt-5 text-xs text-white/25">{project.members} members</p>
          </article>
        ))}
      </div>
    </ModulePage>
  );
}
