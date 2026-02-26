"use client";

import * as React from "react";
import { Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Gradient map for product name suffixes
const suffixGradients: Record<string, string> = {
    MCP: "bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent",
    Voice: "bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent",
    Code: "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent",
    Laboratory: "bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent",
};

function renderPlanName(name: string) {
    // Match "TiltedXxx ..." or "The Laboratory ..."
    const tiltedMatch = name.match(/^Tilted(\w+)\s*(.*)/);
    if (tiltedMatch) {
        const [, suffix, rest] = tiltedMatch;
        return (
            <>
                <span className="text-foreground">Tilted</span>
                <span className={`inline ${suffixGradients[suffix] || "text-foreground"}`}>{suffix}</span>
                {rest && <span className="text-foreground"> {rest}</span>}
            </>
        );
    }
    const labMatch = name.match(/^The (Laboratory)\s*(.*)/);
    if (labMatch) {
        const [, lab, rest] = labMatch;
        return (
            <>
                <span className="text-foreground">The </span>
                <span className={`inline ${suffixGradients[lab] || "text-foreground"}`}>{lab}</span>
                {rest && <span className="text-foreground"> {rest}</span>}
            </>
        );
    }
    return <>{name}</>;
}

const plans = [
    {
        name: "The Laboratory Core",
        description: "For Indian MSMEs and freelancers looking for immediate leverage.",
        monthlyPrice: "$29",
        annualPrice: "$249",
        tagline: "one-time",
        annualTagline: "one-time",
        features: [
            "All current prompt bundles",
            "All n8n workflow templates",
            "WhatsApp automated setups",
            "Future bundle additions",
            "Community Discord access"
        ],
        cta: "Buy All-Access",
        highlight: false,
    },
    {
        name: "TiltedMCP Pro",
        description: "For builders needing production-grade server infrastructure.",
        monthlyPrice: "$29",
        annualPrice: "$290",
        tagline: "per month",
        annualTagline: "per year",
        features: [
            "Unlimited connections",
            "Sub-100ms average latency",
            "Advanced production monitoring",
            "Priority error recovery",
            "Dedicated support thread"
        ],
        cta: "Start Free Trial",
        highlight: true,
    },
    {
        name: "TiltedCode Templates",
        description: "Agentic functional architectures. Buy once, ship forever.",
        monthlyPrice: "$199",
        annualPrice: "$199",
        tagline: "starting at",
        annualTagline: "starting at",
        features: [
            "Pre-wired Next.js / Supabase logic",
            "Agent context .cursorrules included",
            "Lifetime updates",
            "Unlimited personal projects",
            "Standard support"
        ],
        cta: "View Catalog",
        highlight: false,
    }
];

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = React.useState(false);

    return (
        <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/8 blur-[130px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl sm:text-6xl md:text-7xl font-sans font-black mb-6 tracking-tight"
                    >
                        Transparent Pricing.{" "}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                            Infinite Leverage.
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-xl mx-auto"
                    >
                        Whether you need compounding SaaS infrastructure or deployable digital products, we have a scale that fits your velocity.
                    </motion.p>
                </div>

                {/* ── Billing toggle ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center justify-center gap-3 mb-16"
                >
                    <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
                        Monthly
                    </span>
                    <button
                        onClick={() => setIsAnnual(!isAnnual)}
                        className="relative h-7 w-12 rounded-full bg-white/[0.08] border border-white/[0.1] transition-colors hover:bg-white/[0.1]"
                    >
                        <motion.div
                            animate={{ x: isAnnual ? 22 : 2 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="absolute top-[3px] w-5 h-5 rounded-full bg-primary shadow-lg shadow-primary/30"
                        />
                    </button>
                    <span className={`text-sm font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
                        Annual
                    </span>
                    {isAnnual && (
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Save 17%
                        </span>
                    )}
                </motion.div>

                {/* ── Pricing cards ── */}
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                            className={`relative p-8 rounded-2xl flex flex-col transition-all duration-300 ${
                                plan.highlight
                                    ? "border-2 border-primary/50 bg-surface/80 shadow-[0_0_60px_-15px_rgba(99,102,241,0.3)]"
                                    : "border border-white/[0.06] bg-surface/30 hover:bg-surface/50 hover:border-white/[0.1]"
                            }`}
                        >
                            {/* Animated glow border for featured card */}
                            {plan.highlight && (
                                <>
                                    <div className="absolute -top-px -left-px -right-px -bottom-px rounded-2xl bg-[conic-gradient(from_var(--angle,0deg),transparent_60%,hsl(var(--primary))_100%)] opacity-20 -z-10 animate-[spin_6s_linear_infinite]" />
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg shadow-primary/30">
                                            Most Popular
                                        </span>
                                    </div>
                                </>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-2">{renderPlanName(plan.name)}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl sm:text-5xl font-black text-foreground">
                                        {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                                    </span>
                                    <span className="text-muted-foreground text-sm">
                                        {isAnnual ? plan.annualTagline : plan.tagline}
                                    </span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-start gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                            plan.highlight ? "bg-primary/20" : "bg-white/[0.06]"
                                        }`}>
                                            <Check className={`w-3 h-3 ${plan.highlight ? "text-primary" : "text-muted-foreground"}`} />
                                        </div>
                                        <span className="text-sm text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/register"
                                className={`w-full py-3.5 rounded-full font-semibold text-center text-sm transition-all ${
                                    plan.highlight
                                        ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25"
                                        : "bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-foreground"
                                }`}
                            >
                                {plan.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
