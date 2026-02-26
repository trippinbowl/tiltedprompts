"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/animations";
import Badge from "./Badge";

interface SectionHeaderProps {
  label: string;
  heading: React.ReactNode;
  description?: string;
  center?: boolean;
  className?: string;
}

export default function SectionHeader({
  label,
  heading,
  description,
  center = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        center ? "text-center flex flex-col items-center mx-auto" : "text-left",
        "mb-20",
        className
      )}
    >
      <motion.div variants={fadeUp} className="mb-6">
        <div className="inline-flex items-center text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-3)]">
          <span className="w-8 h-px bg-[var(--border-default)] mr-3" />
          {label}
        </div>
      </motion.div>
      <motion.h2
        variants={fadeUp}
        className="font-[var(--font-display)] text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] mb-7 text-white"
      >
        {heading}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className={cn(
            "text-[var(--text-2)] text-lg max-w-[540px] leading-relaxed",
            center && "mx-auto"
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
