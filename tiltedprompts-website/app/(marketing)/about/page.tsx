"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Section from "@/components/ui/Section";
import GlowOrb from "@/components/effects/GlowOrb";
import GridBackground from "@/components/effects/GridBackground";
import { fadeUp, staggerContainer } from "@/lib/animations";

const values = [
  {
    title: "Autonomy",
    description: "We build systems that run themselves. Every product is designed to operate without constant human intervention.",
    icon: "\u2699\uFE0F",
  },
  {
    title: "Speed",
    description: "From intent to production in days, not months. We optimize for deployment velocity at every level of the stack.",
    icon: "\u26A1",
  },
  {
    title: "Precision",
    description: "No bloat, no fluff. Every line of code serves a purpose. We ship functional architecture, not theoretical frameworks.",
    icon: "\uD83C\uDFAF",
  },
  {
    title: "Craft",
    description: "Engineering is a craft. We take pride in clean interfaces, sub-10ms responses, and systems that don't wake you up at 3am.",
    icon: "\uD83D\uDC8E",
  },
];

const techStack = [
  "Next.js", "React", "TypeScript", "TailwindCSS", "Python", "Flask",
  "Model Context Protocol", "WebSocket", "Docker", "Vercel", "n8n", "PostgreSQL",
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden">
        <GridBackground />
        <GlowOrb color="var(--primary)" size={500} top="-15%" left="15%" animation="float-slow" />
        <GlowOrb color="var(--accent-cyan)" size={350} bottom="5%" right="10%" animation="float-slower" delay="3s" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--bg-0)] to-transparent z-[1]" />

        <Container className="relative z-10 py-36">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[700px]"
          >
            <h1 className="font-[var(--font-display)] text-[clamp(2.8rem,6vw,4.5rem)] font-extrabold leading-[1.04] tracking-[-0.04em] mb-7 text-white">
              Close the Gap Between
              <br />
              <span className="gradient-text">Intent and Architecture.</span>
            </h1>
            <p className="text-[var(--text-2)] text-lg md:text-xl leading-relaxed max-w-[580px]">
              TiltedPrompts is a Product AI Agency built for the vibe coding era.
              We don&apos;t just use AI &mdash; we build autonomous teammates that ship
              functional code, MCP servers, and voice agents.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Philosophy */}
      <Section className="relative border-y border-[var(--border-subtle)]">
        <Container>
          <SectionHeader
            label="PHILOSOPHY"
            heading={
              <>
                Technical Direction,
                <br />
                <span className="gradient-text">Not Manual Coding.</span>
              </>
            }
            description="We champion the transition from writing every line by hand to directing software into existence through natural language."
            center={false}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
            <div className="text-[var(--text-2)] leading-[1.8] space-y-5">
              <p>
                The software industry is undergoing its most significant shift since
                the move from assembly to high-level languages. AI agents can now
                write, test, and deploy code at a level that makes traditional
                development workflows obsolete for many use cases.
              </p>
              <p>
                We call this &ldquo;Vibe Coding&rdquo; &mdash; the practice of building
                software through natural language direction rather than manual
                implementation. TiltedPrompts provides the infrastructure, templates,
                and tools to make this workflow production-ready.
              </p>
            </div>
            <div className="text-[var(--text-2)] leading-[1.8] space-y-5">
              <p>
                Our members aren&apos;t &ldquo;users&rdquo; &mdash; they&apos;re Builders
                and Technical Directors. They describe what they want, and our
                products handle the implementation.
              </p>
              <p>
                Every product in the TiltedPrompts suite is built around one
                principle: close the gap between human intent and functional
                architecture. Whether that&apos;s connecting an AI agent to a database
                via MCP, deploying a voice agent that speaks Hindi, or spinning up a
                full SaaS application from a Next.js template.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section>
        <Container>
          <SectionHeader
            label="VALUES"
            heading={
              <>
                What We
                <br />
                <span className="gradient-text">Stand For.</span>
              </>
            }
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className="glass-card rounded-[var(--radius-xl)] p-7 group"
              >
                <div className="text-2xl mb-4">{v.icon}</div>
                <h3 className="text-lg font-bold text-[var(--text-0)] mb-3 tracking-tight">{v.title}</h3>
                <p className="text-[13px] text-[var(--text-2)] leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      {/* Tech Stack */}
      <Section className="border-t border-[var(--border-subtle)]">
        <Container>
          <SectionHeader
            label="STACK"
            heading={
              <>
                Built With
                <br />
                <span className="gradient-text">Modern Tools.</span>
              </>
            }
          />
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {techStack.map((tech) => (
              <motion.span
                key={tech}
                variants={fadeUp}
                className="px-5 py-2.5 rounded-full glass-card text-[13px] font-medium text-[var(--text-2)] hover:text-white hover:border-[var(--border-hover)] transition-all duration-200"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </Container>
      </Section>
    </>
  );
}
