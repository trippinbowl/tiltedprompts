"use client";

import { cn } from "@/lib/utils";

interface GlowOrbProps {
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  className?: string;
  animation?: "float-slow" | "float-slower" | "pulse-glow";
  delay?: string;
}

export default function GlowOrb({
  color = "var(--primary)",
  size = 400,
  top,
  left,
  right,
  bottom,
  className,
  animation = "float-slow",
  delay = "0s",
}: GlowOrbProps) {
  return (
    <div
      className={cn("blob", className)}
      style={{
        width: size,
        height: size,
        background: color,
        top,
        left,
        right,
        bottom,
        animation: `${animation} ${animation === "float-slow" ? "20s" : animation === "float-slower" ? "25s" : "4s"} ease-in-out infinite`,
        animationDelay: delay,
      }}
    />
  );
}
