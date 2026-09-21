import { Crown, Mail, UserPlus, Users } from "lucide-react";
import ModulePage from "@/components/dashboard/ModulePage";

const members = [
  { name: "Pintu Aryan", email: "Workspace owner", role: "Owner", initials: "PA" },
  { name: "Aarav Sharma", email: "aarav@example.com", role: "Admin", initials: "AS" },
  { name: "Meera Joshi", email: "meera@example.com", role: "Member", initials: "MJ" },
];

export default function TeamPage() {
  return (
    <ModulePage eyebrow="Collaboration" title="Team" description="Invite people, manage roles, and keep workspace access organized." icon={Users}>
      <div className="flex justify-end"><button className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black"><UserPlus className="size-4" /> Invite member</button></div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c13]">
        {members.map((member, index) => (
          <div key={member.name} className={`flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center ${index ? "border-t border-white/[0.06]" : ""}`}>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-violet-500/10 text-xs font-semibold text-violet-200">{member.initials}</span>
            <div className="min-w-0 flex-1"><p className="text-sm font-medium">{member.name}</p><p className="mt-1 flex items-center gap-1 text-xs text-white/30"><Mail className="size-3" /> {member.email}</p></div>
            <span className="flex w-fit items-center gap-1 rounded-full border border-white/[0.08] px-2.5 py-1 text-xs text-white/45">{member.role === "Owner" && <Crown className="size-3 text-amber-300" />}{member.role}</span>
          </div>
        ))}
      </div>
    </ModulePage>
  );
}
