"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin, ArrowRight } from "lucide-react";

// Gradient map for product name suffixes
const suffixGradients: Record<string, string> = {
    MCP: "bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent",
    Voice: "bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent",
    Code: "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent",
    Laboratory: "bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent",
};

function renderProductLink(name: string) {
    if (name.startsWith("Tilted")) {
        const suffix = name.slice(6);
        return (
            <>
                <span>Tilted</span>
                <span className={`inline ${suffixGradients[suffix] || ""}`}>{suffix}</span>
            </>
        );
    }
    if (name.startsWith("The ")) {
        const suffix = name.slice(4);
        return (
            <>
                <span>The </span>
                <span className={`inline ${suffixGradients[suffix] || ""}`}>{suffix}</span>
            </>
        );
    }
    return <>{name}</>;
}

const footerLinks = {
    Products: [
        { name: "TiltedMCP", href: "/products/tilted-mcp", isProduct: true },
        { name: "TiltedVoice", href: "/products/tilted-voice", isProduct: true },
        { name: "TiltedCode", href: "/products/tilted-code", isProduct: true },
        { name: "The Laboratory", href: "/products/laboratory", isProduct: true },
    ],
    Company: [
        { name: "About Us", href: "/company/about" },
        { name: "Careers", href: "/company/careers" },
        { name: "Contact", href: "/company/contact" },
        { name: "Pricing", href: "/pricing" },
    ],
    Community: [
        { name: "Documentation", href: "/docs" },
        { name: "Blog", href: "/blog" },
        { name: "Members Area", href: "/members" },
        { name: "GitHub", href: "https://github.com/tiltedprompts" },
    ],
};

export function Footer() {
    const [email, setEmail] = React.useState("");

    return (
        <footer className="relative overflow-hidden">
            {/* Gradient top border */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {/* Subtle bg glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand column */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="flex items-center gap-2.5 mb-6">
                            <Image
                                src="/logo-icon.svg"
                                alt="TiltedPrompts"
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <span className="text-lg tracking-tight text-foreground">
                                <span className="font-normal">Tilted</span><span className="font-bold">Prompts</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-xs mb-6 leading-relaxed">
                            Production-grade AI infrastructure and agentic tooling for the builder economy. Ship software at the speed of thought.
                        </p>

                        {/* Newsletter mini form */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                // Handle newsletter signup
                            }}
                            className="flex gap-2 max-w-xs"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Get updates"
                                className="flex-1 h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                            <button
                                type="submit"
                                className="h-9 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors flex items-center gap-1"
                            >
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </form>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} className="lg:col-span-2">
                            <h3 className="font-semibold text-foreground text-sm mb-4">{category}</h3>
                            <ul className="space-y-2.5">
                                {links.map((link: any) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.isProduct ? renderProductLink(link.name) : link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Social column */}
                    <div className="lg:col-span-2">
                        <h3 className="font-semibold text-foreground text-sm mb-4">Connect</h3>
                        <div className="flex gap-3">
                            <a
                                href="https://twitter.com/tiltedprompts"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a
                                href="https://github.com/tiltedprompts"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                            <a
                                href="https://linkedin.com/company/tiltedprompts"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all"
                            >
                                <Linkedin className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} TiltedPrompts. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
