"use client";

import { motion } from "framer-motion";

const stats = [
    { value: "500+", label: "Builders Shipping", accent: "text-[#C84C31]" },
    { value: "100%", label: "Agentic Architecture", accent: "text-[#1C1C1A]" },
    { value: "<50ms", label: "p99 Latency", accent: "text-[#E28743]" },
];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] as const },
    }),
};

export function StatsSection() {
    return (
        <section className="py-24 relative border-t border-[#1C1C1A]/10 bg-[#FAF9F6]">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 mx-auto mb-32">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-60px" }}
                            custom={i * 0.1}
                            className="text-center sm:text-left relative pl-0 sm:pl-8 sm:border-l border-[#1C1C1A]/10"
                        >
                            <div className={`text-5xl font-serif tracking-tight mb-4 ${stat.accent}`}>
                                {stat.value}
                            </div>
                            <p className="text-sm text-[#1C1C1A]/60 font-mono uppercase tracking-widest">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Philosophy block */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h2 className="text-3xl sm:text-5xl font-serif text-[#1C1C1A] leading-tight mb-8">
                        An <span className="italic text-[#C84C31]">Agentic-First</span> <br />
                        Product Studio
                    </h2>
                    <p className="text-xl text-[#1C1C1A]/70 leading-relaxed font-light">
                        We believe software should be spoken into existence. Our AI agents aren't
                        just tools — they're core teammates that architect, build, test, and deploy.
                        Human intent meets autonomous execution at production scale.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
