"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import GlowOrb from "@/components/effects/GlowOrb";
import GridBackground from "@/components/effects/GridBackground";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { PRICING, FAQS } from "@/lib/constants";

type ProductKey = "mcp" | "voice" | "code" | "laboratory";

const tabs: { key: ProductKey; label: string; color: string }[] = [
  { key: "mcp", label: "TiltedMCP", color: "#06d6a0" },
  { key: "voice", label: "TiltedVoice", color: "#22d3ee" },
  { key: "code", label: "TiltedCode", color: "#818cf8" },
  { key: "laboratory", label: "Laboratory", color: "#ec4899" },
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<ProductKey>("mcp");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const tiers = PRICING[activeTab].tiers;

  return (
    <>
      {/* Hero */}
      <section className="relative py-36 overflow-hidden">
        <GridBackground />
        <GlowOrb color="var(--primary)" size={400} top="-10%" right="10%" animation="float-slow" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--bg-0)] to-transparent z-[1]" />

        <Container className="relative z-10">
          <SectionHeader
            label="PRICING"
            heading={
              <>
                Simple, Transparent
                <br />
                <span className="gradient-text">Pricing.</span>
              </>
            }
            description="Start free. Scale as you grow. No hidden fees, no monthly traps on digital products."
          />

          {/* Product Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-14">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 ${
                  activeTab === tab.key
                    ? "text-white shadow-lg scale-105"
                    : "text-[var(--text-2)] bg-white/[0.03] border border-[var(--border-subtle)] hover:text-white hover:border-[var(--border-hover)]"
                }`}
                style={
                  activeTab === tab.key
                    ? { background: tab.color, boxShadow: `0 0 30px ${tab.color}30` }
                    : undefined
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Pricing Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1000px] mx-auto"
            >
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`glass-card rounded-[var(--radius-xl)] p-8 flex flex-col relative ${
                    tier.highlighted
                      ? "border-[var(--primary)]/40 shadow-[var(--shadow-glow)] scale-[1.02]"
                      : ""
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] font-semibold px-4 py-1.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent-cyan)] text-white">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-[var(--text-0)] tracking-tight">{tier.name}</h3>
                  <p className="text-[13px] text-[var(--text-3)] mt-1.5">{tier.description}</p>
                  <div className="my-7 pb-7 border-b border-[var(--border-subtle)]">
                    {tier.price === -1 ? (
                      <span className="text-4xl font-extrabold font-[var(--font-display)] text-white">Custom</span>
                    ) : tier.price === 0 ? (
                      <span className="text-4xl font-extrabold font-[var(--font-display)] text-white">Free</span>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold font-[var(--font-display)] text-white">${tier.price}</span>
                        <span className="text-sm text-[var(--text-3)]">{tier.period}</span>
                      </div>
                    )}
                  </div>
                  <ul className="space-y-3.5 flex-1">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-[13px] text-[var(--text-2)]">
                        <svg className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button
                      href="/contact"
                      variant={tier.highlighted ? "gradient" : "outline"}
                      className="w-full justify-center"
                    >
                      {tier.cta}
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </Container>
      </section>

      {/* Agency Services */}
      <Section className="border-y border-[var(--border-subtle)]">
        <Container>
          <div className="max-w-[700px] mx-auto text-center">
            <SectionHeader
              label="AGENCY SERVICES"
              heading={
                <>
                  Need Something
                  <br />
                  <span className="gradient-text">Custom?</span>
                </>
              }
              description="We build bespoke AI systems for teams at scale. From custom MCP servers to full voice AI deployments."
            />
            <div className="glass-card-solid rounded-[var(--radius-xl)] p-10 text-left border border-white/[0.06]">
              <div className="text-3xl font-extrabold font-[var(--font-display)] gradient-text mb-2 tracking-tight">
                Starting at ${PRICING.agency.starting.toLocaleString()}
              </div>
              <p className="text-[13px] text-[var(--text-3)] mb-7">per project</p>
              <ul className="space-y-3.5">
                {PRICING.agency.services.map((service) => (
                  <li key={service} className="flex items-start gap-2.5 text-[13px] text-[var(--text-2)]">
                    <svg className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {service}
                  </li>
                ))}
              </ul>
              <div className="mt-9">
                <Button href="/contact" variant="gradient" className="w-full justify-center" size="lg">
                  Talk to Sales
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section>
        <Container>
          <SectionHeader
            label="FAQ"
            heading={
              <>
                Got Questions?
                <br />
                <span className="gradient-text">We&apos;ve Got Answers.</span>
              </>
            }
          />

          <motion.div
            className="max-w-[720px] mx-auto space-y-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="glass-card rounded-[var(--radius-md)] overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left text-[14px] font-semibold text-[var(--text-0)] hover:bg-white/[0.03] transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <svg
                    className="w-4 h-4 text-[var(--text-3)] transition-transform duration-200 shrink-0 ml-4"
                    style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-5 text-[13px] text-[var(--text-2)] leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>
    </>
  );
}
