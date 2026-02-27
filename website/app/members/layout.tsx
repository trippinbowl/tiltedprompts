"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    Library, Box, Cpu, Workflow,
    Terminal, Settings, LogOut, Moon, Sun, Code2, LayoutDashboard, Menu
} from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/utils/supabase/client";

const sidebarLinks = [
    { name: "Dashboard Hub", href: "/members", icon: LayoutDashboard, color: "text-foreground" },
    { name: "Prompts Library", href: "/members/prompts", icon: Library, color: "text-blue-400" },
    { name: "OpenClaw Skills", href: "/members/skills", icon: Terminal, color: "text-emerald-400" },
    { name: "n8n Workflows", href: "/members/n8n", icon: Workflow, color: "text-orange-400" },
    { name: "AI Agents", href: "/members/agents", icon: Cpu, color: "text-purple-400" },
    { name: "Chrome Extensions", href: "/members/extensions", icon: Box, color: "text-cyan-400" },
    { name: "TiltedCode Assets", href: "/members/code", icon: Code2, color: "text-pink-400" },
];

const tierDisplay: Record<string, { label: string; color: string }> = {
    free: { label: "Free Tier", color: "text-foreground" },
    pro: { label: "Pro", color: "text-purple-400" },
    agency: { label: "Agency", color: "text-yellow-400" },
};

export default function MembersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { setTheme, theme } = useTheme();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [userTier, setUserTier] = useState<string>("free");
    const [userInitials, setUserInitials] = useState<string>("..");
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        async function loadProfile() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const email = user.email || "";
            setUserInitials(email.substring(0, 2).toUpperCase());

            const { data: profile } = await supabase
                .from("profiles")
                .select("tier")
                .eq("id", user.id)
                .single();

            if (profile?.tier) {
                setUserTier(profile.tier);
            }
        }
        loadProfile();
    }, []);

    async function handleLogout() {
        setIsLoggingOut(true);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
    }

    const tier = tierDisplay[userTier] || tierDisplay.free;
    const isPro = userTier === "pro" || userTier === "agency";

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:relative md:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isCollapsed ? 'md:w-[72px] w-64' : 'w-64 md:w-60'} 
                bg-surface border-r border-white/[0.06] flex flex-col
            `}>

                {/* Logo header */}
                <div
                    className="h-14 flex items-center justify-between px-4 border-b border-white/[0.06] cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <Image
                            src="/logo-icon.svg"
                            alt="TiltedPrompts"
                            width={22}
                            height={22}
                            className="w-[22px] h-[22px] shrink-0"
                        />
                        <span className={`font-sans font-bold text-sm tracking-tight whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                            Members
                        </span>
                    </div>
                    {!isCollapsed && (
                        <Menu className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 overflow-x-hidden">
                    {!isCollapsed && (
                        <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-3">
                            Libraries
                        </p>
                    )}
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                title={isCollapsed ? link.name : undefined}
                                className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? "bg-white/[0.06] text-foreground"
                                    : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
                                    }`}
                            >
                                {/* Active pill indicator */}
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
                                )}
                                <link.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-primary" : link.color}`} />
                                {!isCollapsed && <span className="whitespace-nowrap">{link.name}</span>}
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom section */}
                <div className="p-3 border-t border-white/[0.06] space-y-2 overflow-hidden">
                    {!isCollapsed ? (
                        <>
                            {/* Tier badge */}
                            <div className={`px-3 py-2.5 rounded-lg border ${isPro
                                ? 'bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-purple-500/15'
                                : 'bg-white/[0.02] border-white/[0.06]'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Plan</p>
                                        <p className={`text-sm font-bold ${tier.color}`}>{tier.label}</p>
                                    </div>
                                    {!isPro && (
                                        <Link href="/pricing" className="text-xs font-semibold text-primary hover:underline">
                                            Upgrade
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <Link
                                href="/members/settings"
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-white/[0.03] hover:text-foreground transition-all"
                            >
                                <Settings className="w-[18px] h-[18px]" />
                                Settings
                            </Link>

                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-white/[0.03] hover:text-foreground transition-all border border-white/[0.06]"
                                >
                                    <Sun className="h-3.5 w-3.5 dark:hidden" />
                                    <Moon className="h-3.5 w-3.5 hidden dark:block" />
                                    <span className="text-xs">Theme</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all border border-white/[0.06] disabled:opacity-50"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-1.5 items-center">
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                title="Toggle Theme"
                                className="flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-white/[0.03] hover:text-foreground transition-all"
                            >
                                <Sun className="h-4 w-4 dark:hidden" />
                                <Moon className="h-4 w-4 hidden dark:block" />
                            </button>
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                title="Log out"
                                className="flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all disabled:opacity-50"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 overflow-y-auto w-full">
                {/* Glass header bar */}
                <header className="h-14 border-b border-white/[0.06] flex items-center justify-between px-4 md:px-8 bg-background/60 backdrop-blur-xl sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-foreground hover:bg-white/[0.05] rounded-lg md:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="text-base font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
                            {sidebarLinks.find(link => link.href === pathname)?.name || "Dashboard"}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* User avatar with gradient ring */}
                        <div className="relative">
                            <div className="absolute -inset-[2px] rounded-full bg-gradient-to-br from-primary to-accent opacity-60" />
                            <div className="relative w-8 h-8 rounded-full bg-surface border border-background flex items-center justify-center">
                                <span className="font-bold text-xs text-foreground">{userInitials}</span>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
