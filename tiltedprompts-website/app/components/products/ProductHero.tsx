"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import GlowOrb from "@/components/effects/GlowOrb";
import GridBackground from "@/components/effects/GridBackground";

interface ProductHeroProps {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  color: string;
  ctaText: string;
  ctaHref: string;
  children?: React.ReactNode;
}

export default function ProductHero({
  badge,
  title,
  highlight,
  description,
  color,
  ctaText,
  ctaHref,
  children,
}: ProductHeroProps) {
  return (
    <section className="relative min-h-[75vh] flex items-center overflow-hidden">
      <GridBackground />
      <GlowOrb color={color} size={500} top="-10%" left="5%" animation="float-slow" />
      <GlowOrb color={color} size={300} bottom="5%" right="5%" animation="float-slower" delay="3s" className="opacity-10" />

      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--bg-0)] to-transparent z-[1]" />

      <Container className="relative z-10 py-36 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <Badge className="mb-7">{badge}</Badge>
            <h1 className="font-[var(--font-display)] text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[1.06] tracking-[-0.03em] mb-6 text-white">
              {title}
              <br />
              <span style={{ color }}>{highlight}</span>
            </h1>
            <p className="text-[var(--text-2)] text-lg md:text-xl max-w-[520px] leading-relaxed mb-9">
              {description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href={ctaHref} variant="gradient" size="lg">
                {ctaText}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
              <Button href="/pricing" variant="outline" size="lg">
                View Pricing
              </Button>
            </div>
          </motion.div>

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
}
