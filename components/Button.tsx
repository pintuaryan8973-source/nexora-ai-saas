import type { MouseEventHandler, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
}

const variants: Record<Variant, string> = {
  primary:
    "border-violet-300/20 bg-gradient-to-b from-violet-500 to-violet-700 text-white shadow-[0_10px_35px_rgba(109,40,217,0.32)] hover:from-violet-400 hover:to-violet-600 focus-visible:ring-violet-400",
  secondary:
    "border-white/10 bg-white/[0.06] text-white shadow-lg shadow-black/10 hover:bg-white/[0.1] focus-visible:ring-white/40",
  ghost:
    "border-transparent bg-transparent text-white/70 hover:bg-white/[0.05] hover:text-white focus-visible:ring-white/30",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 rounded-lg px-3.5 text-sm",
  md: "min-h-11 rounded-xl px-5 text-sm",
  lg: "min-h-12 rounded-xl px-6 text-sm sm:text-[15px]",
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  iconLeft,
  iconRight,
  onClick,
  type = "button",
  ariaLabel,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 border font-medium transition duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05050a] active:translate-y-px",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        aria-label={ariaLabel}
      >
        {iconLeft}
        <span>{children}</span>
        {iconRight}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      aria-label={ariaLabel}
    >
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}
