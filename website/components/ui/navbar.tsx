"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

// Gradient map for product name suffixes
const productGradients: Record<string, string> = {
    MCP: "bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent",
    Voice: "bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent",
    Vani: "bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent",
    Code: "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent",
    Laboratory: "bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent",
};

function renderProductName(name: string) {
    if (name.startsWith("Tilted")) {
        const suffix = name.slice(6);
        return (
            <>
                <span className="text-foreground">Tilted</span>
                <span className={`inline ${productGradients[suffix] || "text-foreground"}`}>{suffix}</span>
            </>
        );
    }
    if (name.startsWith("The ")) {
        const suffix = name.slice(4);
        return (
            <>
                <span className="text-foreground">The </span>
                <span className={`inline ${productGradients[suffix] || "text-foreground"}`}>{suffix}</span>
            </>
        );
    }
    return <>{name}</>;
}

const navLinks = [
    {
        name: "Products",
        href: "/products",
        hasDropdown: true,
        dropdownItems: [
            { name: "TiltedMCP", href: "/products/tilted-mcp", desc: "Production-grade MCP Servers" },
            { name: "TiltedVoice", href: "/products/tilted-voice", desc: "English Voice AI (Whisper)" },
            { name: "TiltedVani", href: "/products/tilted-vani", desc: "Hindi Voice AI + Translation" },
            { name: "TiltedCode", href: "/products/tilted-code", desc: "Agentic Next.js Templates" },
            { name: "The Laboratory", href: "/products/laboratory", desc: "n8n & WhatsApp Automation" },
        ]
    },
    { name: "Libraries", href: "/members" },
    {
        name: "Community",
        href: "/community",
        hasDropdown: true,
        dropdownItems: [
            { name: "Documentation", href: "/docs", desc: "Guides and API References" },
            { name: "GitHub", href: "https://github.com/tiltedprompts", desc: "Open Source Repositories" },
            { name: "Blog", href: "/blog", desc: "Latest updates and tutorials" },
        ]
    },
    {
        name: "Company",
        href: "/company",
        hasDropdown: true,
        dropdownItems: [
            { name: "About Us", href: "/company/about", desc: "Our mission and thesis" },
            { name: "Careers", href: "/company/careers", desc: "Join the team" },
            { name: "Contact", href: "/company/contact", desc: "Get in touch with sales" },
        ]
    },
    { name: "Pricing", href: "/pricing" },
];

export function Navbar({ user }: { user?: any }) {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
    const { setTheme, theme } = useTheme();
    const pathname = usePathname();

    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <>
            <header
                className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-500 ${isScrolled
                    ? "bg-background/80 backdrop-blur-2xl shadow-2xl shadow-black/20 border border-white/[0.08]"
                    : "bg-background/40 backdrop-blur-xl border border-white/[0.05]"
                    } rounded-full`}
            >
                <div className="px-4 sm:px-6 h-14 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 z-50 shrink-0">
                        <Image
                            src="/logo-icon.svg"
                            alt="TiltedPrompts"
                            width={24}
                            height={24}
                            className="w-6 h-6"
                        />
                        <span className="text-base tracking-tight text-foreground">
                            <span className="font-normal">Tilted</span><span className="font-bold">Prompts</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <div
                                key={link.name}
                                className="relative"
                                onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    href={link.href}
                                    className={`relative text-[13px] font-medium transition-colors px-3 py-2 rounded-full flex items-center gap-1 hover:text-foreground ${pathname?.startsWith(link.href)
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                        }`}
                                >
                                    {link.name}
                                    {link.hasDropdown && (
                                        <ChevronDown
                                            className={`w-3 h-3 opacity-50 transition-transform duration-200 ${activeDropdown === link.name ? "rotate-180" : ""
                                                }`}
                                        />
                                    )}
                                    {/* Active indicator line */}
                                    {pathname?.startsWith(link.href) && (
                                        <motion.span
                                            layoutId="navbar-active"
                                            className="absolute -bottom-0.5 left-3 right-3 h-px bg-primary"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>

                                {/* Dropdown Menu */}
                                {link.hasDropdown && (
                                    <AnimatePresence>
                                        {activeDropdown === link.name && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                                transition={{ duration: 0.15, ease: "easeOut" }}
                                                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 overflow-hidden rounded-2xl border border-white/[0.08] bg-background/90 backdrop-blur-2xl shadow-2xl shadow-black/30"
                                                style={{ transformOrigin: "top center" }}
                                            >
                                                {/* Top glow line */}
                                                <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                                                <div className="p-1.5">
                                                    {link.dropdownItems?.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            className="group flex flex-col px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors"
                                                        >
                                                            <span className="text-sm font-semibold transition-colors">
                                                                {renderProductName(item.name)}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground mt-0.5">
                                                                {item.desc}
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="hidden lg:flex items-center gap-2">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/[0.05]"
                            aria-label="Toggle theme"
                        >
                            <Sun className="h-4 w-4 dark:hidden" />
                            <Moon className="h-4 w-4 hidden dark:block" />
                        </button>
                        {user ? (
                            <Link
                                href="/members"
                                className="relative inline-flex h-8 items-center justify-center overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                            >
                                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#6366f1_0%,#a78bfa_50%,#6366f1_100%)]" />
                                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background px-4 text-[13px] font-semibold text-foreground backdrop-blur-3xl transition-colors hover:bg-background/80">
                                    Dashboard
                                </span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="relative inline-flex h-8 items-center justify-center overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                                >
                                    <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#6366f1_0%,#a78bfa_50%,#6366f1_100%)]" />
                                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background px-4 text-[13px] font-semibold text-foreground backdrop-blur-3xl transition-colors hover:bg-background/80">
                                        Get Started
                                    </span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden flex items-center gap-2 z-50">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 text-muted-foreground hover:text-foreground rounded-full"
                        >
                            <Sun className="h-4 w-4 dark:hidden" />
                            <Moon className="h-4 w-4 hidden dark:block" />
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-foreground hover:bg-white/[0.05] rounded-full transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 lg:hidden"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <motion.nav
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.25, delay: 0.05 }}
                            className="relative z-10 pt-24 px-6 pb-8 flex flex-col gap-1"
                        >
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="flex items-center justify-between text-2xl font-semibold text-foreground py-3 hover:text-primary transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                        {link.hasDropdown && <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                                    </Link>
                                    {link.hasDropdown && link.dropdownItems && (
                                        <div className="pl-4 pb-2 flex flex-col gap-1">
                                            {link.dropdownItems.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="text-base text-muted-foreground hover:text-foreground py-1.5 transition-colors"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            <div className="h-px bg-border my-4" />

                            {user ? (
                                <Link
                                    href="/members"
                                    className="w-full text-center bg-primary text-primary-foreground py-3.5 rounded-full font-semibold mt-2 text-base"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-lg font-medium text-muted-foreground py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="w-full text-center bg-primary text-primary-foreground py-3.5 rounded-full font-semibold mt-2 text-base"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
