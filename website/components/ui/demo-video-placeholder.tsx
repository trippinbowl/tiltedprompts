"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export function DemoVideoPlaceholder() {
    return (
        <section className="py-24 sm:py-32 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
                    className="max-w-5xl md:mx-auto relative rounded-[2rem] overflow-hidden aspect-video border border-white/[0.08] bg-surface/40 shadow-2xl group cursor-pointer"
                >
                    {/* Placeholder Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-background to-emerald-500/10 opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Simulated App UI Header */}
                    <div className="absolute top-0 w-full h-12 border-b border-white/[0.06] bg-black/20 flex items-center px-6 gap-2 backdrop-blur-md">
                        <div className="w-3 h-3 rounded-full bg-white/20" />
                        <div className="w-3 h-3 rounded-full bg-white/20" />
                        <div className="w-3 h-3 rounded-full bg-white/20" />
                    </div>

                    {/* Centered Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] group-hover:bg-white/15 transition-all duration-500"
                        >
                            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white ml-2 opacity-90" />
                        </motion.div>
                    </div>

                    {/* Faux Product Label */}
                    <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full border border-white/[0.08] bg-black/40 backdrop-blur-md">
                        <span className="text-xs font-medium text-white/80 uppercase tracking-widest">
                            TiltedVoice Demo &middot; 02:14
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
