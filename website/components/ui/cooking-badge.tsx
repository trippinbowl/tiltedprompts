"use client";

import { motion } from "framer-motion";

type CookingStage = "prep" | "cooking" | "plating" | "served";

const stageConfig: Record<CookingStage, { label: string; color: string; progress: number; emoji: string }> = {
    prep: { label: "Prepping Ingredients", color: "from-amber-400 to-orange-400", progress: 15, emoji: "🧑‍🍳" },
    cooking: { label: "Cooking in the Kitchen", color: "from-orange-400 to-red-400", progress: 45, emoji: "🔥" },
    plating: { label: "Plating Up", color: "from-emerald-400 to-teal-400", progress: 75, emoji: "🍽️" },
    served: { label: "Served & Live", color: "from-green-400 to-emerald-400", progress: 100, emoji: "✅" },
};

export function CookingBadge({ stage }: { stage: CookingStage }) {
    const config = stageConfig[stage];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex flex-col items-center gap-2"
        >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <span className="text-sm">{config.emoji}</span>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    {config.label}
                </span>
            </div>
            {/* Progress bar */}
            <div className="w-48 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${config.progress}%` }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${config.color}`}
                />
            </div>
        </motion.div>
    );
}
