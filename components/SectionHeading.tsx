import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  align?: "left" | "center";
}

export default function SectionHeading({ eyebrow, title, description, align = "center" }: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div className={`max-w-2xl ${alignment}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300/80">{eyebrow}</div>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-pretty text-sm leading-6 text-white/50 sm:text-base sm:leading-7">{description}</p>
    </div>
  );
}
