import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-[rgba(99,102,241,0.08)] border border-[var(--border-subtle)]",
        "text-[var(--primary-light)] text-xs font-semibold tracking-widest uppercase",
        "backdrop-blur-sm",
        className
      )}
    >
      {children}
    </span>
  );
}
