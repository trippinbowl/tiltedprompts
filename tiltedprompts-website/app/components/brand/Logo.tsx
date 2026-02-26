import Link from "next/link";
import LogoIcon from "./LogoIcon";
import { cn } from "@/lib/utils";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 group", className)}>
      <LogoIcon size={30} />
      <span className="text-[1.1rem] font-[var(--font-display)] tracking-tight select-none">
        <span className="font-light text-[var(--text-1)] group-hover:text-white transition-colors">Tilted</span>
        <span className="font-bold text-white">Prompts</span>
      </span>
    </Link>
  );
}
