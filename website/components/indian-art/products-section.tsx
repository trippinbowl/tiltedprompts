"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/indian-art/ui/card";

const products = [
    {
        prefix: "Tilted",
        suffix: "MCP",
        description: "Production-hardened Model Context Protocol servers. Latency benchmarked, connection pooled, securely managed.",
        badge: "Infrastructure",
        href: "/indian-art/products/tilted-mcp",
    },
    {
        prefix: "Tilted",
        suffix: "Voice",
        description: "On-device voice-to-text via Whisper. 99 languages, fully offline, GPU-accelerated. Your audio never leaves your device.",
        badge: "Audio Core",
        href: "/indian-art/products/tilted-voice",
    },
    {
        prefix: "Tilted",
        suffix: "Vani",
        description: "Hindi voice-to-text with automatic English translation. Pure Devanagari output powered by Sarvam AI. Built for Bharat.",
        badge: "Localization",
        href: "/indian-art/products/tilted-vani",
    },
    {
        prefix: "Tilted",
        suffix: "Code",
        description: "Vibe coding architecture. Next.js templates pre-wired for intelligent editing by AI coding assistants.",
        badge: "Templates",
        href: "/indian-art/products/tilted-code",
    },
    {
        prefix: "The ",
        suffix: "Laboratory",
        description: "High-velocity n8n workflows, WhatsApp marketing automation, and rapid-prototyping engine for emerging markets.",
        badge: "Workflows",
        href: "/indian-art/products/laboratory",
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] as const },
    }),
};

export function ProductsSection() {
    return (
        <section className="py-32 relative bg-white border-y border-[#1C1C1A]/10 z-10">
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="mb-20">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        custom={0}
                        className="mb-6"
                    >
                        <span className="text-xs font-mono text-[#C84C31] uppercase tracking-widest px-3 py-1 bg-[#C84C31]/10 rounded-sm">Products</span>
                    </motion.div>
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        custom={0.1}
                        className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#1C1C1A] tracking-tight mb-6"
                    >
                        The Full-Stack Logic Engine
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        custom={0.2}
                        className="text-xl text-[#1C1C1A]/70 max-w-2xl font-light"
                    >
                        Five product primitives spanning infrastructure, voice, templates, and automation.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.suffix}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-40px" }}
                            custom={index * 0.1}
                        >
                            <Link href={product.href} className="group block h-full">
                                <Card className="p-10 h-full flex flex-col transition-all duration-500 hover:border-[#E28743]/40 hover:bg-[#FAF9F6]">
                                    <div className="mb-8">
                                        <span className="text-[10px] uppercase tracking-widest font-mono text-[#1C1C1A]/50 group-hover:text-[#E28743] transition-colors">{product.badge}</span>
                                    </div>

                                    <h3 className="text-3xl font-serif mb-4 text-[#1C1C1A]">
                                        <span>{product.prefix}</span>
                                        <span className={product.suffix === 'Vani' || product.suffix === 'MCP' ? 'italic text-[#C84C31]' : ''}>{product.suffix}</span>
                                    </h3>

                                    <p className="text-[#1C1C1A]/60 leading-relaxed font-light mb-8 flex-1">
                                        {product.description}
                                    </p>

                                    <div className="mt-auto">
                                        <span className="inline-flex items-center gap-2 text-sm font-medium text-[#1C1C1A]/50 group-hover:text-[#1C1C1A] transition-colors uppercase tracking-wider">
                                            Learn more
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
