"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BookOpen,
    Rocket,
    Server,
    Mic2,
    Languages,
    Code2,
    FlaskConical,
    ChevronRight,
} from "lucide-react";

const sidebarLinks = [
    {
        name: "Overview",
        href: "/docs",
        icon: BookOpen,
        description: "Platform introduction",
    },
    {
        name: "Getting Started",
        href: "/docs/getting-started",
        icon: Rocket,
        description: "Setup & first steps",
    },
    {
        name: "TiltedMCP",
        href: "/docs/tilted-mcp",
        icon: Server,
        description: "Managed MCP platform",
        gradient: "from-indigo-400 to-violet-400",
    },
    {
        name: "TiltedVoice",
        href: "/docs/tilted-voice",
        icon: Mic2,
        description: "English Voice AI (Whisper)",
        gradient: "from-emerald-400 to-teal-300",
    },
    {
        name: "TiltedVani",
        href: "/docs/tilted-vani",
        icon: Languages,
        description: "Hindi Voice + Translation",
        gradient: "from-amber-400 to-orange-400",
    },
    {
        name: "TiltedCode",
        href: "/docs/tilted-code",
        icon: Code2,
        description: "Agentic templates",
        gradient: "from-blue-400 to-cyan-400",
    },
    {
        name: "The Laboratory",
        href: "/docs/laboratory",
        icon: FlaskConical,
        description: "Automation workflows",
        gradient: "from-orange-400 to-rose-400",
    },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen pt-28 pb-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                    {/* Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-28">
                            <div className="flex items-center gap-2 mb-6 px-3">
                                <BookOpen className="w-5 h-5 text-primary" />
                                <span className="text-sm font-bold tracking-wide uppercase text-muted-foreground">
                                    Documentation
                                </span>
                            </div>
                            <nav className="flex flex-col gap-1">
                                {sidebarLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${isActive
                                                    ? "bg-primary/10 text-foreground font-semibold"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                                                }`}
                                        >
                                            {/* Active pill indicator */}
                                            {isActive && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-primary" />
                                            )}
                                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                                            <div className="flex flex-col">
                                                <span>{link.name}</span>
                                                <span className="text-xs text-muted-foreground/60 font-normal">
                                                    {link.description}
                                                </span>
                                            </div>
                                            <ChevronRight
                                                className={`w-3 h-3 ml-auto opacity-0 -translate-x-1 transition-all ${isActive
                                                        ? "opacity-60 translate-x-0"
                                                        : "group-hover:opacity-40 group-hover:translate-x-0"
                                                    }`}
                                            />
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Quick Links */}
                            <div className="mt-8 pt-6 border-t border-border px-3">
                                <p className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider mb-3">
                                    Resources
                                </p>
                                <div className="flex flex-col gap-2">
                                    <a
                                        href="https://github.com/tiltedprompts"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        GitHub Repositories →
                                    </a>
                                    <Link
                                        href="/pricing"
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Pricing Plans →
                                    </Link>
                                    <Link
                                        href="/company/contact"
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Contact Support →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Docs Nav */}
                    <div className="lg:hidden w-full mb-6">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                            {sidebarLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${isActive
                                                ? "bg-primary/15 text-foreground border border-primary/30"
                                                : "bg-secondary/40 text-muted-foreground border border-border hover:text-foreground"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 max-w-4xl">{children}</div>
                </div>
            </div>
        </div>
    );
}
