"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Container from "@/components/ui/Container";
import { fadeUp, staggerContainer } from "@/lib/animations";

interface Feature {
  title: string;
  description: string;
}

interface FeatureGridProps {
  label: string;
  heading: React.ReactNode;
  description?: string;
  features: Feature[];
  color: string;
}

export default function FeatureGrid({
  label,
  heading,
  description,
  features,
  color,
}: FeatureGridProps) {
  return (
    <Section className="relative">
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[250px] opacity-[0.04]"
        style={{ background: color }}
      />

      <Container>
        <SectionHeader label={label} heading={heading} description={description} />
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="glass-card rounded-[var(--radius-lg)] p-7 transition-all duration-400 hover:border-[var(--border-hover)] hover:-translate-y-1 group"
            >
              <div
                className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center text-sm font-bold mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: color + "12", color }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-[15px] font-bold text-[var(--text-0)] mb-2 tracking-tight">{feature.title}</h3>
              <p className="text-[13px] text-[var(--text-2)] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
