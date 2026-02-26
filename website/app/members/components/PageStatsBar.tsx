import { TrendingUp, Package, Clock } from "lucide-react";

interface PageStatsBarProps {
    totalCount: number;
    newThisWeek: number;
    label: string; // e.g. "prompts", "workflows", "skills"
}

export default function PageStatsBar({ totalCount, newThisWeek, label }: PageStatsBarProps) {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-8">
            {/* Total count */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.06] bg-surface/40">
                <Package className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{totalCount}</span>
                <span className="text-sm text-muted-foreground">{label}</span>
            </div>

            {/* New this week */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                newThisWeek > 0
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-white/[0.06] bg-surface/40"
            }`}>
                {newThisWeek > 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={`text-sm font-semibold ${newThisWeek > 0 ? "text-emerald-400" : "text-muted-foreground"}`}>
                    +{newThisWeek}
                </span>
                <span className="text-sm text-muted-foreground">added this week</span>
            </div>
        </div>
    );
}
