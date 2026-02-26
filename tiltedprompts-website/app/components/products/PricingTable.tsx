"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { fadeUp, staggerContainer } from "@/lib/animations";

interface Tier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

interface PricingTableProps {
  tiers: Tier[];
}

export default function PricingTable({ tiers }: PricingTableProps) {
  return (
    <Section className="relative">
      <Container>
        <SectionHeader
          label="PRICING"
          heading={
            <>
              Simple, Transparent
              <br />
              <span className="gradient-text">Pricing.</span>
            </>
          }
          description="Start free. Scale as you grow. No hidden fees."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1000px] mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={fadeUp}
              className={`glass-card rounded-[var(--radius-xl)] p-8 flex flex-col relative transition-all duration-300 ${
                tier.highlighted
                  ? "border-[var(--primary)]/40 shadow-[var(--shadow-glow)] scale-[1.02]"
                  : "hover:border-[var(--border-hover)]"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] font-semibold px-4 py-1.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent-cyan)] text-white tracking-wide">
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-bold text-[var(--text-0)] tracking-tight">{tier.name}</h3>
              <p className="text-[13px] text-[var(--text-3)] mt-1.5">{tier.description}</p>

              <div className="my-7 pb-7 border-b border-[var(--border-subtle)]">
                {tier.price === -1 ? (
                  <span className="text-4xl font-extrabold font-[var(--font-display)] text-white tracking-tight">Custom</span>
                ) : tier.price === 0 ? (
                  <span className="text-4xl font-extrabold font-[var(--font-display)] text-white tracking-tight">Free</span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold font-[var(--font-display)] text-white tracking-tight">
                      ${tier.price}
                    </span>
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
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
