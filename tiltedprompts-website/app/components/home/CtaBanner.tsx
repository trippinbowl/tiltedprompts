"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { fadeUp } from "@/lib/animations";

export default function CtaBanner() {
  return (
    <section className="section-block py-40 border-t border-[var(--border-subtle)]">
      <div className="container-standard">
        <motion.div
          variants={fadeUp}
          className="relative rounded-[var(--radius-xl)] p-12 md:p-20 overflow-hidden"
        >
          {/* Background card structure */}
          <div className="absolute inset-0 bg-white/[0.02] border border-white/[0.04]" />

          {/* Subtle gradient effects */}
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-[var(--primary)] rounded-full blur-[200px] opacity-[0.05] pointer-events-none" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-[var(--accent-cyan)] rounded-full blur-[200px] opacity-[0.04] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-[var(--font-display)] text-[clamp(2.2rem,4vw,3.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] mb-7 text-white">
                Stop Debating.
                <br />
                <span className="gradient-text">Start Deploying.</span>
              </h2>
              <p className="text-[var(--text-2)] text-lg md:text-xl max-w-[500px] mb-0 leading-relaxed">
                Unlock the agentic era. Ship at the speed of thought with production-ready MCP servers and custom AI collectives.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Button href="/products" variant="gradient" size="lg" className="px-10">
                Get Started Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
              <Button href="/contact" variant="outline" size="lg" className="px-10">
                Talk to Sales
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
