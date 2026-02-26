import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "gradient" | "outline" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "px-5 py-2.5 text-sm gap-2",
  md: "px-7 py-3.5 text-sm gap-2.5",
  lg: "px-9 py-4 text-base gap-3",
};

const variants: Record<ButtonVariant, string> = {
  gradient:
    "btn-gradient relative inline-flex items-center rounded-full font-semibold text-white transition-all duration-400",
  outline:
    "btn-ghost inline-flex items-center rounded-full font-medium text-[var(--text-1)] transition-all duration-300",
  ghost:
    "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-[var(--text-2)] transition-all duration-200 hover:text-[var(--text-0)] hover:bg-white/[0.04]",
};

export default function Button({
  children,
  href,
  variant = "gradient",
  className = "",
  onClick,
  type = "button",
  size = "md",
}: ButtonProps) {
  const classes = cn(
    variants[variant],
    variant !== "ghost" && sizeClasses[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
