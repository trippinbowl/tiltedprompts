"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Globe, Cpu, Layers, GitBranch } from "lucide-react";

const values = [
    {
        icon: Cpu,
        title: "Built by Agents",
        description: "AI agents aren't tools in our workflow — they're core architects. Every product is designed, tested, and deployed with autonomous systems as first-class teammates.",
    },
    {
        icon: Zap,
        title: "Built for Builders",
        description: "We obsess over developer velocity. Our infrastructure compresses weeks into hours, letting you go from idea to deployed product at the speed of intent.",
    },
    {
        icon: GitBranch,
        title: "The Agentic Era",
        description: "We're building for a world where human creativity directs AI execution. The gap between imagination and production is closing — we're accelerating the collapse.",
    },
];

const features = [
    {
        icon: Shield,
        title: "Production-Grade Default",
        description: "No fragile demos. Every server and template is security-hardened and enterprise-ready.",
    },
    {
        icon: Globe,
        title: "Global Reach, Localized",
        description: "Native support for regional languages down to the dialect level. Built for emerging markets.",
    },
    {
        icon: Layers,
        title: "Editor Agnostic",
        description: "Works seamlessly with Claude Code, Cursor, Windsurf, and any MCP-compatible environment.",
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

export function FeaturesSection() {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[160px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section header */}
                <div className="text-center mb-20">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        custom={0}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6"
                    >
                        <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                            Core Principles
                        </span>
                    </motion.div>
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        custom={0.1}
                        className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight mb-6"
                    >
                        Engineered for{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                            Autonomous Systems
                        </span>
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        custom={0.2}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                    >
                        Every decision optimized for machine-speed execution. We build the primitives
                        that autonomous agents use to construct reality.
                    </motion.p>
                </div>

                {/* Value cards — 3 column, Bridgemind style */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-20">
                    {values.map((value, index) => (
                        <motion.div
                            key={value.title}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-40px" }}
                            custom={index * 0.1}
                            className="group relative p-8 rounded-2xl border border-white/[0.06] bg-surface/30 hover:bg-surface/60 transition-all duration-300 hover:border-white/[0.1] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20"
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                                <value.icon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-foreground">{value.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Smaller feature pills — 3 column */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-40px" }}
                            custom={0.3 + index * 0.08}
                            className="flex items-start gap-3 p-5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                        >
                            <feature.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
