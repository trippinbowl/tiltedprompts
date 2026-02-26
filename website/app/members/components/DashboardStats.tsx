import { Library, Terminal, Workflow, Cpu, Box, Code2, TrendingUp } from "lucide-react";

interface CategoryStat {
    label: string;
    total: number;
    newThisWeek: number;
    icon: React.ElementType;
    color: string;
    gradient: string;
}

interface DashboardStatsProps {
    stats: CategoryStat[];
}

export function buildCategoryStats(counts: {
    prompts: number;
    promptsNew: number;
    skills: number;
    skillsNew: number;
    workflows: number;
    workflowsNew: number;
    agents: number;
    agentsNew: number;
    code: number;
    codeNew: number;
}): CategoryStat[] {
    return [
        {
            label: "Prompts",
            total: counts.prompts,
            newThisWeek: counts.promptsNew,
            icon: Library,
            color: "text-blue-400",
            gradient: "from-blue-500 to-indigo-500",
        },
        {
            label: "Skills",
            total: counts.skills,
            newThisWeek: counts.skillsNew,
            icon: Terminal,
            color: "text-emerald-400",
            gradient: "from-emerald-400 to-teal-500",
        },
        {
            label: "Workflows",
            total: counts.workflows,
            newThisWeek: counts.workflowsNew,
            icon: Workflow,
            color: "text-orange-400",
            gradient: "from-orange-500 to-rose-500",
        },
        {
            label: "AI Agents",
            total: counts.agents,
            newThisWeek: counts.agentsNew,
            icon: Cpu,
            color: "text-purple-400",
            gradient: "from-purple-500 to-pink-500",
        },
        {
            label: "Code Assets",
            total: counts.code,
            newThisWeek: counts.codeNew,
            icon: Code2,
            color: "text-cyan-400",
            gradient: "from-cyan-400 to-blue-500",
        },
    ];
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
    const totalAll = stats.reduce((sum, s) => sum + s.total, 0);
    const newAll = stats.reduce((sum, s) => sum + s.newThisWeek, 0);

    return (
        <div className="mb-10">
            {/* Top summary row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/20 bg-primary/5">
                    <Box className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">{totalAll}</span>
                    <span className="text-sm text-muted-foreground">total assets</span>
                </div>
                {newAll > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-400">+{newAll}</span>
                        <span className="text-sm text-muted-foreground">added this week</span>
                    </div>
                )}
            </div>

            {/* Category breakdown grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="relative p-4 rounded-xl border border-white/[0.06] bg-surface/30 overflow-hidden group hover:border-white/[0.1] transition-all"
                    >
                        {/* Accent bar */}
                        <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${stat.gradient} opacity-40 group-hover:opacity-80 transition-opacity`} />

                        <div className="flex items-center gap-2 mb-2">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-foreground">{stat.total}</span>
                            {stat.newThisWeek > 0 && (
                                <span className="text-xs font-semibold text-emerald-400">+{stat.newThisWeek}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
