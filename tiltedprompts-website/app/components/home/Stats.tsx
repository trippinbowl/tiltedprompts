"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import { fadeUp } from "@/lib/animations";
import { STATS } from "@/lib/constants";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2200;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="section-block border-y border-[var(--border-subtle)] bg-[var(--bg-1)]/30 py-40">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--primary)]/[0.02] to-transparent pointer-events-none" />

      <div className="container-standard">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-end">
          {/* Left: Section Info */}
          <div className="lg:col-span-4">
            <div className="inline-flex items-center text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--accent)] mb-6">
              <span className="w-8 h-px bg-[var(--accent)]/30 mr-3" />
              Scale
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
              Building at the <br /><span className="text-[var(--text-3)] font-medium">Edge of Intelligence.</span>
            </h2>
          </div>

          {/* Right: Stats Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col gap-1"
              >
                <div className="text-3xl md:text-4xl font-extrabold font-[var(--font-display)] text-white tracking-tighter">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
