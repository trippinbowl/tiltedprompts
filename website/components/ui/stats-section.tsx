"use client";

import { motion } from "framer-motion";

const stats = [
    { value: "500+", label: "Builders Shipping", accent: "from-primary to-accent" },
    { value: "100%", label: "Agentic Architecture", accent: "from-indigo-400 to-violet-400" },
    { value: "<50ms", label: "p99 Latency", accent: "from-emerald-400 to-teal-300" },
];

const fadeUp = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] as const },
    }),
};

export function StatsSection() {
    return (
        <section className="py-24 relative">
            <div className="container mx-auto px-4">
                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-60px" }}
                            custom={i * 0.1}
                            className="text-center"
                        >
                            <div className={`text-4xl sm:text-5xl font-black tracking-tight mb-2 bg-gradient-to-r ${stat.accent} bg-clip-text text-transparent`}>
                                {stat.value}
                            </div>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Philosophy block */}
                <motion.div
                    initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight mb-6">
                        An{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                            Agentic-First
                        </span>{" "}
                        Product Studio
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        We believe software should be spoken into existence. Our AI agents aren&apos;t
                        just tools — they&apos;re core teammates that architect, build, test, and deploy.
                        Human intent meets autonomous execution at production scale.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
