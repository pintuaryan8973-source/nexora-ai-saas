import type { LucideIcon } from "lucide-react";

export default function ModulePage({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-violet-300">
            <Icon className="size-4" /> {eyebrow}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">{description}</p>
        </div>
      </div>
      <div className="mt-7">{children}</div>
    </div>
  );
}
