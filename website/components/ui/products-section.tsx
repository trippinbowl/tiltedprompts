"use client";

import { motion } from "framer-motion";
import { Server, Mic, Code2, Workflow, Languages, ArrowRight } from "lucide-react";
import Link from "next/link";

// Gradient map for product name suffixes
const suffixGradientMap: Record<string, string> = {
    MCP: "bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent",
    Voice: "bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent",
    Vani: "bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent",
    Code: "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent",
    Laboratory: "bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent",
};

const products = [
    {
        prefix: "Tilted",
        suffix: "MCP",
        description: "Production-hardened Model Context Protocol servers. Latency benchmarked, connection pooled, securely managed.",
        icon: Server,
        gradient: "from-indigo-500 to-violet-500",
        borderHover: "hover:border-indigo-500/30",
        href: "/products/tilted-mcp",
    },
    {
        prefix: "Tilted",
        suffix: "Voice",
        description: "On-device voice-to-text via Whisper. 99 languages, fully offline, GPU-accelerated. Your audio never leaves your device.",
        icon: Mic,
        gradient: "from-emerald-400 to-teal-500",
        borderHover: "hover:border-emerald-500/30",
        href: "/products/tilted-voice",
    },
    {
        prefix: "Tilted",
        suffix: "Vani",
        description: "Hindi voice-to-text with automatic English translation. Pure Devanagari output powered by Sarvam AI. Built for Bharat.",
        icon: Languages,
        gradient: "from-amber-400 to-orange-500",
        borderHover: "hover:border-amber-500/30",
        href: "/products/tilted-vani",
    },
    {
        prefix: "Tilted",
        suffix: "Code",
        description: "Vibe coding architecture. Next.js templates pre-wired for intelligent editing by AI coding assistants.",
        icon: Code2,
        gradient: "from-blue-500 to-cyan-500",
        borderHover: "hover:border-blue-500/30",
        href: "/products/tilted-code",
    },
    {
        prefix: "The ",
        suffix: "Laboratory",
        description: "High-velocity n8n workflows, WhatsApp marketing automation, and rapid-prototyping engine for emerging markets.",
        icon: Workflow,
        gradient: "from-orange-500 to-rose-500",
        borderHover: "hover:border-orange-500/30",
        href: "/products/laboratory",
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] as const },
    }),
};

export function ProductsSection() {
    return (
        <section className="py-32 relative">
            {/* Subtle radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        custom={0}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6"
                    >
                        <span className="text-xs font-semibold text-primary uppercase tracking-widest">Products</span>
                    </motion.div>
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        custom={0.1}
                        className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight mb-6"
                    >
                        The Full-Stack Logic Engine
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        custom={0.2}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        Five product primitives spanning infrastructure, voice, templates, and automation.
                    </motion.p>
                </div>

                {/* 3-col grid — top row of 3, bottom row of 2 centered */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.suffix}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-40px" }}
                            custom={index * 0.1}
                        >
                            <Link
                                href={product.href}
                                className={`group relative block p-8 sm:p-10 rounded-2xl border border-white/[0.06] bg-surface/30 transition-all duration-300 ${product.borderHover} hover:bg-surface/60 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 overflow-hidden`}
                            >
                                {/* Hover radial glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(400px_circle_at_50%_50%,rgba(99,102,241,0.04),transparent_60%)] pointer-events-none" />

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${product.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <product.icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-foreground">
                                        <span>{product.prefix}</span>
                                        <span className={`inline ${suffixGradientMap[product.suffix] || "text-foreground"}`}>{product.suffix}</span>
                                    </h3>

                                    {/* Description */}
                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        {product.description}
                                    </p>

                                    {/* CTA link */}
                                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                                        Learn more
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
