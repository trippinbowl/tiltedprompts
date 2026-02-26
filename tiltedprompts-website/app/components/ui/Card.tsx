"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/animations";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "glass-card rounded-[var(--radius-lg)] p-6",
        hover && "transition-all duration-400 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-glow-sm)] hover:-translate-y-1",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
