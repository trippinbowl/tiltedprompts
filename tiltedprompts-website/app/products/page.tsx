"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import GlowOrb from "@/components/effects/GlowOrb";
import GridBackground from "@/components/effects/GridBackground";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { PRODUCTS } from "@/lib/constants";

const productIcons: Record<string, string> = {
  "tilted-mcp": "⚡",
  "tilted-code": "💻",
  "tilted-space": "🌐",
  "tilted-voice": "🎙️",
  "tilted-coin": "💰",
};

const productGradients: Record<string, string> = {
  "tilted-mcp": "from-[#06d6a0]/10 to-transparent",
  "tilted-code": "from-[#6366f1]/10 to-transparent",
  "tilted-space": "from-[#f59e0b]/10 to-transparent",
  "tilted-voice": "from-[#00b4d8]/10 to-transparent",
  "tilted-coin": "from-[#ec4899]/10 to-transparent",
};

export default function ProductsOverview() {
  return (
    <section className="relative min-h-screen py-36 overflow-hidden">
      <GridBackground />
      <GlowOrb color="var(--primary)" size={500} top="0%" left="-5%" animation="float-slow" />
      <GlowOrb color="var(--accent-cyan)" size={350} bottom="10%" right="-5%" animation="float-slower" delay="3s" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--bg-0)] to-transparent z-[1]" />

      <Container className="relative z-10">
        <SectionHeader
          label="PRODUCT SUITE"
          heading={
            <>
              Five Products.
              <br />
              <span className="gradient-text">One Vision.</span>
            </>
          }
          description="Close the gap between human intent and functional architecture. Every product in the TiltedPrompts suite is built for builders who deploy, not debate."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {PRODUCTS.map((product) => (
            <motion.div key={product.id} variants={fadeUp}>
              <Link
                href={product.href}
                className="glass-card rounded-[var(--radius-xl)] p-9 flex flex-col h-full group relative overflow-hidden"
              >
                {/* Hover gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${productGradients[product.id]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{ background: product.color + "12", color: product.color }}
                    >
                      {productIcons[product.id] || "\u2699\uFE0F"}
                    </div>
                    <svg
                      className="w-5 h-5 text-[var(--text-3)] transition-all duration-300 group-hover:text-[var(--primary-light)] group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </div>

                  <h3 className="text-2xl font-extrabold font-[var(--font-display)] text-white mb-2 tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: product.color }}>
                    {product.tagline}
                  </p>
                  <p className="text-sm text-[var(--text-2)] leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-20">
          <p className="text-[var(--text-3)] text-sm mb-6">
            Need a custom solution? We build bespoke AI systems for teams at scale.
          </p>
          <Button href="/contact" variant="outline">
            Talk to Sales
          </Button>
        </div>
      </Container>
    </section>
  );
}
