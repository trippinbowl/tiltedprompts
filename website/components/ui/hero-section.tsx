"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

const taglines = ["Builder Economy", "AI Frontier", "Next Billion", "Vibe Coders"];

// Shared entrance variant
const fadeUp = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] as const },
    }),
};

export function HeroSection() {
    const [taglineIndex, setTaglineIndex] = React.useState(0);
    const sectionRef = React.useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });
    const orbY1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 60]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setTaglineIndex((prev) => (prev + 1) % taglines.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* ── Background ── */}
            <div className="absolute inset-0 z-0">
                {/* Two subtle gradient orbs — slow drift */}
                <motion.div
                    style={{ y: orbY1 }}
                    className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-primary/15 blur-[150px]"
                />
                <motion.div
                    style={{ y: orbY2 }}
                    className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-accent/10 blur-[130px]"
                />

                {/* Grid overlay — ultra subtle */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_40%,transparent_100%)]" />

                {/* Bottom fade to next section */}
                <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-background to-transparent" />
            </div>

            <motion.div
                style={{ opacity: heroOpacity }}
                className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center max-w-4xl"
            >
                {/* ── Pill badge ── */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md mb-10"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                        Tilted<span className="inline bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">MCP</span> 2.0 is now live
                    </span>
                </motion.div>

                {/* ── Main heading ── */}
                <motion.h1
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.1}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-black tracking-tighter leading-[0.95] mb-8"
                >
                    Ship Software at
                    <br />
                    the Speed of{" "}
                    <span className="relative inline-block">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={taglines[taglineIndex]}
                                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
                                transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
                                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
                            >
                                {taglines[taglineIndex]}
                            </motion.span>
                        </AnimatePresence>
                    </span>
                </motion.h1>

                {/* ── Subheading ── */}
                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.2}
                    className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
                >
                    Go from prompt to production in days, not months.
                    The agentic coding platform where builders turn natural language
                    into deployed applications.
                </motion.p>

                {/* ── CTA Buttons ── */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.3}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-semibold text-white bg-primary hover:bg-primary/90 rounded-full transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Link
                            href="/docs"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-foreground bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] rounded-full transition-all backdrop-blur-md"
                        >
                            Read the Docs
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* ── Scroll indicator ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-1 text-muted-foreground/40"
                >
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll</span>
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </motion.div>
        </section>
    );
}
