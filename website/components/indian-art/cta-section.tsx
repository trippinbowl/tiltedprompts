"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/indian-art/ui/button";

export function CTASection() {
    return (
        <section className="py-40 relative overflow-hidden bg-[#FAF9F6]">
            {/* The global abstract background SVG from layout handles the global glow, 
                we just add a subtle localized one here for emphasis */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E28743]/5 blur-[120px] rounded-full z-0 pointer-events-none" />

            <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
                <motion.h2
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
                    className="text-5xl sm:text-7xl font-serif text-[#1C1C1A] leading-tight mb-8"
                >
                    Ready to ship at the <br />
                    <span className="text-[#C84C31] italic">
                        speed of thought?
                    </span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                    className="text-xl text-[#1C1C1A]/70 max-w-2xl mx-auto mb-14 font-light leading-relaxed"
                >
                    Join developers and technical directors using TiltedPrompts
                    infrastructure to build the next generation of software.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <Link href="/indian-art/register" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto h-14 px-10 text-lg flex gap-3">
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href="/indian-art/docs" className="w-full sm:w-auto px-8 py-4 text-[#1C1C1A] hover:text-[#C84C31] transition-colors border-b border-transparent hover:border-[#C84C31]">
                        Read the Documentation
                    </Link>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-xs font-mono uppercase tracking-widest text-[#1C1C1A]/40 mt-12"
                >
                    No credit card required &middot; Free tier forever
                </motion.p>
            </div>
        </section>
    );
}
