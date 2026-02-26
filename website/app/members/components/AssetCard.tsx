import Link from 'next/link';
import { Library, Workflow, Terminal, Box, Lock, Code2, Cpu, ArrowRight } from "lucide-react";

interface AssetCardProps {
    asset: any;
}

export default function AssetCard({ asset }: AssetCardProps) {
    let categoryColor = "text-primary";
    let Icon = Library;
    let accentGradient = "from-primary to-accent";

    switch (asset.asset_type) {
        case 'prompt_bundle':
            categoryColor = "text-blue-400";
            Icon = Box;
            accentGradient = "from-blue-500 to-indigo-500";
            break;
        case 'n8n_workflow':
            categoryColor = "text-orange-400";
            Icon = Workflow;
            accentGradient = "from-orange-500 to-rose-500";
            break;
        case 'openclaw_skill':
            categoryColor = "text-emerald-400";
            Icon = Terminal;
            accentGradient = "from-emerald-400 to-teal-500";
            break;
        case 'gpt_config':
        case 'voice_agent':
            categoryColor = "text-purple-400";
            Icon = Cpu;
            accentGradient = "from-purple-500 to-pink-500";
            break;
        case 'code_template':
            categoryColor = "text-cyan-400";
            Icon = Code2;
            accentGradient = "from-cyan-400 to-blue-500";
            break;
    }

    return (
        <div className="group relative p-6 rounded-xl border border-white/[0.06] bg-surface/30 hover:bg-surface/60 transition-all duration-300 hover:border-white/[0.1] overflow-hidden flex flex-col">
            {/* Hover glow underneath */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(300px_circle_at_50%_100%,rgba(99,102,241,0.06),transparent_60%)] pointer-events-none" />

            {/* Accent bar at top */}
            <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${accentGradient} opacity-40 group-hover:opacity-80 transition-opacity`} />

            <div className="relative z-10 flex flex-col flex-1">
                {/* Header: badge + icon */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                        {asset.is_premium ? (
                            <div className="relative overflow-hidden px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                {/* Shimmer on pro badge */}
                                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.08] to-transparent bg-[length:200%_auto]" />
                                <Lock className="w-3 h-3 relative z-10" />
                                <span className="relative z-10">Pro</span>
                            </div>
                        ) : (
                            <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                Free
                            </div>
                        )}
                    </div>
                    <div className={`p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] group-hover:bg-white/[0.06] transition-colors ${categoryColor}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold mb-2 text-foreground">{asset.title}</h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-6 min-h-[48px] line-clamp-3 leading-relaxed">
                    {asset.description}
                </p>

                {/* CTA */}
                <div className="mt-auto">
                    <Link
                        href={`/members/assets/${asset.id}`}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                            asset.is_premium
                                ? 'bg-white/[0.02] border-white/[0.06] text-muted-foreground group-hover:border-purple-500/30 group-hover:text-purple-400 group-hover:bg-purple-500/5'
                                : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground group-hover:border-emerald-500/30 group-hover:text-emerald-400 group-hover:bg-emerald-500/5'
                        }`}
                    >
                        {asset.is_premium ? 'Upgrade to Access' : 'Access Bundle'}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
