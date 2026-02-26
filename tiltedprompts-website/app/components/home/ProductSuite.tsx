"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import Container from "@/components/ui/Container";
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

export default function ProductSuite() {
  return (
    <section id="products" className="section-block py-40 border-t border-[var(--border-subtle)]">
      <div className="container-standard">
        <SectionHeader
          label="THE SUITE"
          heading={
            <>
              The Agentic
              <br />
              <span className="gradient-text">Product Suite.</span>
            </>
          }
          description="Every product in the TiltedPrompts suite is built for builders who deploy, not debate. From intent to functional architecture."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {PRODUCTS.map((product) => (
            <motion.div key={product.id} variants={fadeUp}>
              <Link
                href={product.href}
                className="glass-card rounded-[var(--radius-lg)] p-7 flex flex-col h-full group relative overflow-hidden"
              >
                {/* Hover gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${productGradients[product.id]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: product.color + "12",
                        color: product.color,
                      }}
                    >
                      {productIcons[product.id] || "⚙️"}
                    </div>
                    <svg
                      className="w-4 h-4 text-[var(--text-3)] transition-all duration-300 group-hover:text-[var(--primary-light)] group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-80" style={{ color: product.color }}>
                    {product.tagline}
                  </p>
                  <p className="text-sm text-[var(--text-2)] leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
