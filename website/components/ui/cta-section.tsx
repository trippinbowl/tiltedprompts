"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 blur-[140px] rounded-full" />
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-accent/8 blur-[120px] rounded-full" />
            </div>

            <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
                <motion.h2
                    initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
                    className="text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight mb-6"
                >
                    Ready to ship at the{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                        speed of thought?
                    </span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                    className="text-lg text-muted-foreground max-w-xl mx-auto mb-10"
                >
                    Join developers and technical directors using TiltedPrompts
                    infrastructure to build the next generation of software.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-semibold text-white bg-primary hover:bg-primary/90 rounded-full transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                        >
                            Get Started Free
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Link
                            href="/pricing"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-foreground bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] rounded-full transition-all"
                        >
                            View Pricing
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-sm text-muted-foreground mt-6"
                >
                    No credit card required &middot; Free tier forever
                </motion.p>
            </div>
        </section>
    );
}
