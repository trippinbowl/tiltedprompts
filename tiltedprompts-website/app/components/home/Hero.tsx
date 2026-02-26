"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import GridBackground from "@/components/effects/GridBackground";
import GlowOrb from "@/components/effects/GlowOrb";

const codeLines = [
  { type: "comment", text: "// Connect AI agents to any data source" },
  { type: "comment", text: "// via Model Context Protocol" },
  { type: "blank" },
  {
    type: "code",
    parts: [
      { text: "import", color: "var(--accent-pink)" },
      { text: " { ", color: "var(--text-3)" },
      { text: "MCPServer", color: "var(--accent-cyan)" },
      { text: " } ", color: "var(--text-3)" },
      { text: "from", color: "var(--accent-pink)" },
      { text: ' "', color: "var(--text-3)" },
      { text: "@tilted/mcp", color: "var(--accent)" },
      { text: '"', color: "var(--text-3)" },
    ],
  },
  { type: "blank" },
  {
    type: "code",
    parts: [
      { text: "const ", color: "var(--accent-pink)" },
      { text: "server", color: "var(--primary-light)" },
      { text: " = ", color: "var(--text-3)" },
      { text: "new ", color: "var(--accent-pink)" },
      { text: "MCPServer", color: "var(--accent-cyan)" },
      { text: "({", color: "var(--text-3)" },
    ],
  },
  {
    type: "code",
    parts: [
      { text: "  name", color: "var(--text-1)" },
      { text: ": ", color: "var(--text-3)" },
      { text: '"sqlite-agent"', color: "var(--accent)" },
      { text: ",", color: "var(--text-3)" },
    ],
  },
  {
    type: "code",
    parts: [
      { text: "  latency", color: "var(--text-1)" },
      { text: ": ", color: "var(--text-3)" },
      { text: '"<10ms"', color: "var(--accent)" },
      { text: ",", color: "var(--text-3)" },
    ],
  },
  {
    type: "code",
    parts: [{ text: "})", color: "var(--text-3)" }],
  },
  { type: "blank" },
  {
    type: "code",
    parts: [
      { text: "await ", color: "var(--accent-pink)" },
      { text: "server", color: "var(--primary-light)" },
      { text: ".", color: "var(--text-3)" },
      { text: "deploy", color: "var(--accent-cyan)" },
      { text: "()", color: "var(--text-3)" },
    ],
  },
];

export default function Hero() {
  return (
    <section className="section-block min-h-screen flex items-center overflow-hidden">
      {/* Background Effects */}
      <GridBackground />
      <GlowOrb color="var(--primary)" size={600} top="-15%" left="-10%" animation="float-slow" />
      <GlowOrb color="var(--accent-cyan)" size={450} top="10%" right="-12%" animation="float-slower" delay="2s" />
      <GlowOrb color="var(--accent-pink)" size={350} bottom="-5%" left="25%" animation="float-slower" delay="4s" />

      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[var(--bg-0)] to-transparent z-[1]" />

      <div className="relative z-10 container-standard pt-48 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
        {/* Left — Copy */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[640px]"
        >
          <Badge className="mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            The Vibe Coded Product AI Agency
          </Badge>

          <h1 className="font-[var(--font-display)] text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.08] tracking-[-0.03em] mb-6 text-white">
            Ship Software at the
            <br />
            <span className="gradient-text">Speed of Thought.</span>
          </h1>

          <p className="text-[var(--text-2)] text-lg md:text-xl max-w-[500px] leading-[1.6] mb-10">
            Go from prompt to production in days, not months. High-performance agentic platforms built with natural language.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/signup" variant="gradient" size="lg">
              Get Started
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
            <Button href="/discord" variant="outline" size="lg">
              Join Discord
            </Button>
          </div>
        </motion.div>

        {/* Right — Code Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden lg:block"
        >
          {/* Glow behind card */}
          <div className="absolute -inset-4 rounded-[var(--radius-2xl)] bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-[var(--accent-cyan)]/10 blur-xl opacity-60" />

          <div className="relative glass-card-solid rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-xl)] border border-white/[0.08]">
            {/* Window Header */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ef4444]/80" />
                <span className="w-3 h-3 rounded-full bg-[#f59e0b]/80" />
                <span className="w-3 h-3 rounded-full bg-[#22c55e]/80" />
              </div>
              <span className="ml-3 text-[12px] font-[var(--font-mono)] text-[var(--text-3)]">
                mcp-server.ts
              </span>
              <div className="ml-auto flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="text-[10px] text-[var(--accent)] font-medium">LIVE</span>
              </div>
            </div>

            {/* Code Content */}
            <div className="px-5 py-5 font-[var(--font-mono)] text-[13px] leading-[1.85] overflow-hidden">
              {codeLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
                >
                  {line.type === "blank" ? (
                    <div className="h-[1.85em]" />
                  ) : line.type === "comment" ? (
                    <div className="text-[var(--text-3)] opacity-60">{line.text}</div>
                  ) : (
                    <div className="flex flex-wrap">
                      {line.parts?.map((part, j) => (
                        <span key={j} style={{ color: part.color }}>
                          {part.text}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-medium">
                  MCP Active
                </span>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary-light)] font-medium">
                  TypeScript
                </span>
              </div>
              <span className="text-[11px] text-[var(--text-3)] font-[var(--font-mono)]">
                &lt;10ms latency
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-0)] to-transparent z-[1]" />
    </section>
  );
}
