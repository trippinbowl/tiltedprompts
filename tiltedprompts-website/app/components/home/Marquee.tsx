"use client";

import { MARQUEE_ITEMS } from "@/lib/constants";

export default function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="relative overflow-hidden py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-1)]/30 backdrop-blur-sm">
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{ animation: "ticker 60s linear infinite" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-4 text-[11px] font-bold text-[var(--text-3)] tracking-[0.2em] uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] opacity-30" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
