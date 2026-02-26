"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Container from "@/components/ui/Container";
import { fadeUp } from "@/lib/animations";
import { TESTIMONIALS } from "@/lib/constants";

export default function SocialProof() {
  const [active, setActive] = useState(0);
  const len = TESTIMONIALS.length;

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % len), 8000);
    return () => clearInterval(timer);
  }, [len]);

  const t = TESTIMONIALS[active];

  return (
    <section id="proof" className="section-block py-40 border-t border-[var(--border-subtle)]">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <div className="absolute top-1/2 left-0 w-px h-64 bg-gradient-to-b from-transparent via-[var(--primary)] to-transparent" />
      </div>

      <div className="container-standard">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          {/* Left: Heading & Small Meter */}
          <div className="lg:col-span-5">
            <SectionHeader
              label="RESULTS"
              heading={
                <>
                  Don&apos;t Take Our Word.
                  <br />
                  <span className="gradient-text">Take Theirs.</span>
                </>
              }
              description="Real results from real builders shipping with TiltedPrompts."
              className="mb-12"
            />

            {/* Metric Preview */}
            <motion.div
              key={`metric-${active}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex flex-col gap-1 px-6 py-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
            >
              <div className="text-2xl font-bold text-white tracking-tight">
                {t.metric}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
                Key Performance Indicator
              </div>
            </motion.div>
          </div>

          {/* Right: The Quote */}
          <div className="lg:col-span-7 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Large Quote Icon Backdrop */}
                <div className="absolute -top-12 -left-8 text-[120px] font-serif text-white opacity-[0.03] select-none pointer-events-none">
                  &ldquo;
                </div>

                <blockquote className="relative">
                  <p className="text-[clamp(1.25rem,3vw,1.85rem)] font-medium text-[var(--text-0)] leading-[1.5] mb-10 tracking-tight">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <footer className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent-cyan)] flex items-center justify-center text-sm font-bold text-white shadow-xl">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-base font-bold text-white">{t.author}</div>
                      <div className="text-sm text-[var(--text-3)] font-medium">{t.role}</div>
                    </div>
                  </footer>
                </blockquote>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls - Minimalist */}
            <div className="flex items-center gap-8 mt-16">
              <div className="flex gap-2.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: active === i ? 32 : 12,
                      background: active === i ? "var(--primary)" : "var(--border-default)",
                    }}
                    aria-label={`Show testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setActive((p) => (p - 1 + len) % len)}
                  className="w-10 h-10 rounded-full border border-[var(--border-default)] text-[var(--text-3)] flex items-center justify-center hover:border-[var(--primary)] hover:text-white transition-all duration-300"
                  aria-label="Previous"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setActive((p) => (p + 1) % len)}
                  className="w-10 h-10 rounded-full border border-[var(--border-default)] text-[var(--text-3)] flex items-center justify-center hover:border-[var(--primary)] hover:text-white transition-all duration-300"
                  aria-label="Next"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
