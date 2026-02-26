"use client";

import { motion } from "framer-motion";

export default function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid overlay — BridgeMind style */}
      <div className="absolute inset-0 grid-pattern opacity-100" />

      {/* Moving "Data Lines" to simulate video background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <motion.div
          animate={{
            y: ["0%", "100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--primary)] to-transparent h-[50%]"
        />
        <motion.div
          animate={{
            y: ["0%", "100%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 7,
          }}
          className="absolute inset-x-0 top-[-50%] h-[50%] bg-gradient-to-b from-transparent via-[var(--accent-cyan)] to-transparent"
        />
      </div>

      {/* Radial gradient fade to black edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 30%, transparent 0%, var(--bg-0) 100%)",
        }}
      />

      {/* Noise texture for that raw vibe */}
      <div className="absolute inset-0 noise-overlay opacity-[0.15]" />
    </div>
  );
}
