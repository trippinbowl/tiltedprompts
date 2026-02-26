"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import GlowOrb from "@/components/effects/GlowOrb";
import GridBackground from "@/components/effects/GridBackground";

type TrackType = "project" | "support";

const inputClasses =
  "w-full px-4 py-3.5 rounded-[var(--radius-md)] bg-white/[0.03] border border-[var(--border-subtle)] text-[var(--text-1)] text-sm placeholder:text-[var(--text-3)] focus:outline-none focus:border-[var(--primary)]/50 focus:ring-1 focus:ring-[var(--primary)]/20 transition-all duration-200";

export default function ContactPage() {
  const [track, setTrack] = useState<TrackType>("project");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative min-h-screen py-36 overflow-hidden">
      <GridBackground />
      <GlowOrb color="var(--primary)" size={450} top="5%" left="-10%" animation="float-slow" />
      <GlowOrb color="var(--accent-cyan)" size={350} bottom="10%" right="-5%" animation="float-slower" delay="3s" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--bg-0)] to-transparent z-[1]" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[640px] mx-auto"
        >
          <div className="text-center mb-14">
            <h1 className="font-[var(--font-display)] text-[clamp(2.4rem,5vw,3.8rem)] font-extrabold leading-[1.06] tracking-[-0.03em] mb-5 text-white">
              Let&apos;s
              <span className="gradient-text"> Build.</span>
            </h1>
            <p className="text-[var(--text-2)] text-lg">
              Whether you need a custom AI system or product support, we&apos;re here.
            </p>
          </div>

          {/* Track Selector */}
          <div className="flex rounded-full bg-white/[0.03] border border-[var(--border-subtle)] p-1 mb-10 backdrop-blur-sm">
            <button
              onClick={() => setTrack("project")}
              className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                track === "project"
                  ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent-cyan)] text-white shadow-lg"
                  : "text-[var(--text-2)] hover:text-[var(--text-0)]"
              }`}
            >
              Start a Project
            </button>
            <button
              onClick={() => setTrack("support")}
              className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                track === "support"
                  ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent-cyan)] text-white shadow-lg"
                  : "text-[var(--text-2)] hover:text-[var(--text-0)]"
              }`}
            >
              Product Support
            </button>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              className="glass-card-solid rounded-[var(--radius-xl)] p-14 text-center border border-white/[0.06]"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Message Received.</h2>
              <p className="text-[var(--text-2)]">
                We&apos;ll get back to you within 24 hours. Check your inbox.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="glass-card-solid rounded-[var(--radius-xl)] p-9 space-y-6 border border-white/[0.06]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-[var(--text-3)] mb-2.5">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    className={inputClasses}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-[var(--text-3)] mb-2.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className={inputClasses}
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              {track === "project" && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-[var(--text-3)] mb-2.5">
                      Company
                    </label>
                    <input
                      type="text"
                      className={inputClasses}
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-[var(--text-3)] mb-2.5">
                      Budget Range
                    </label>
                    <select className={inputClasses}>
                      <option value="">Select range</option>
                      <option value="2-5k">$2,000 - $5,000</option>
                      <option value="5-10k">$5,000 - $10,000</option>
                      <option value="10-25k">$10,000 - $25,000</option>
                      <option value="25k+">$25,000+</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-[var(--text-3)] mb-2.5">
                  {track === "project" ? "Tell us about your project" : "How can we help?"}
                </label>
                <textarea
                  required
                  rows={5}
                  className={`${inputClasses} resize-none`}
                  placeholder={
                    track === "project"
                      ? "Describe what you want to build, the problem you're solving, and any technical requirements..."
                      : "What product are you using? What issue are you experiencing?"
                  }
                />
              </div>

              <Button type="submit" variant="gradient" size="lg" className="w-full justify-center">
                {track === "project" ? "Send Project Brief" : "Send Support Request"}
              </Button>
            </form>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
