"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/animations";

const features = [
    {
        title: "Built by Agents",
        description: "We treat AI agents as core teammates, not just tools. They plan, implement, and review our own codebase.",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
    },
    {
        title: "Built for Builders",
        description: "We empower the next generation of software creators to ship production-grade apps at impossible speeds.",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        ),
    },
    {
        title: "The Agentic Era",
        description: "We are defining the future of work where human intent meets autonomous AI execution.",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
];

export default function Organization() {
    return (
        <section id="philosophy" className="section-block py-40 border-t border-[var(--border-subtle)]">
            {/* Subtle background glow */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[var(--primary)] rounded-full blur-[250px] opacity-[0.03] pointer-events-none" />

            <div className="container-standard">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                    {/* Left: Heading & Philosophy */}
                    <div className="lg:col-span-6">
                        <SectionHeader
                            label="PHILOSOPHY"
                            heading={
                                <>
                                    An Agentic
                                    <br />
                                    <span className="gradient-text">Organization.</span>
                                </>
                            }
                            description="TiltedPrompts isn't just a platform; it's a new way of building. We are an agentic organization where AI agents are integral collaborators in everything we ship."
                            className="mb-8"
                        />

                        <motion.p
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-[var(--text-1)] text-lg leading-relaxed max-w-[500px]"
                        >
                            We believe software should be spoken into existence. By leveraging vibe coding, we close the gap between human intent and working software, allowing builders to operate as technical directors while AI handles the execution.
                        </motion.p>
                    </div>

                    {/* Right: Storytelling Blocks */}
                    <div className="lg:col-span-6 flex flex-col gap-10">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative p-8 rounded-[var(--radius-xl)] bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-[var(--primary)]/20 transition-all duration-500"
                            >
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary-light)] shrink-0 transition-transform duration-300 group-hover:scale-110">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                                            {feature.title}
                                        </h3>
                                        <p className="text-[var(--text-2)] leading-relaxed text-sm md:text-base">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
