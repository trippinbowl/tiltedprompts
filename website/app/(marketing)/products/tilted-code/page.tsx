"use client";

import { Code2, Bot, LayoutTemplate, FolderTree, ArrowRight, Github, FileText } from "lucide-react";
import Link from "next/link";
import { DemoVideoPlaceholder } from "@/components/ui/demo-video-placeholder";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TiltedCodePage() {
    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4">
                {/* 1. Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                        <Code2 className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tight mb-6">
                        Tilted<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Code</span>
                    </h1>
                    <p className="text-2xl text-muted-foreground font-light mb-6">
                        Templates pre-wired for AI coding agents. Don&apos;t write code — direct the system.
                    </p>
                    <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Production starters infused with agent context files, MCP connections, and design systems. The AI doesn&apos;t just generate raw functions — it generates code that fits your exact architecture.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Button className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full shadow-lg shadow-blue-500/25">
                            <Github className="w-5 h-5 mr-2" />
                            Clone Repositories
                        </Button>
                        <Link href="/docs/tilted-code">
                            <Button variant="outline" className="h-14 px-8 text-base font-medium rounded-full border-border hover:bg-white/[0.04]">
                                <FileText className="w-5 h-5 mr-2" />
                                Read the Documentation
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* 2. Demo Video Placeholder */}
                <div className="mb-32">
                    <DemoVideoPlaceholder />
                </div>

                {/* 3. Core Features Grid */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">Vibe Coding Default</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Stop fighting context windows. These templates are meticulously structured so Cursor and Claude understand the entire codebase instantly.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300">
                            <FolderTree className="w-10 h-10 text-cyan-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Agent-First Wiring</h3>
                            <p className="text-muted-foreground leading-relaxed">Context files (`.cursorrules`) and strict architectural patterns designed specifically to be ingested and extended by LLMs.</p>
                        </Card>
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300">
                            <LayoutTemplate className="w-10 h-10 text-blue-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Full-Stack Primitives</h3>
                            <p className="text-muted-foreground leading-relaxed">Auth, database connections, UI components, and API routes pre-assembled. No more starting from a blank terminal.</p>
                        </Card>
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300">
                            <Bot className="w-10 h-10 text-indigo-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Modern Toolchain</h3>
                            <p className="text-muted-foreground leading-relaxed">App Router, Server Actions, Tailwind v4, Framer Motion, and robust database ORMs. Real tools for real deployment.</p>
                        </Card>
                    </div>
                </div>

                {/* 4. Cross-link to Documentation */}
                <Link href="/docs/tilted-code" className="block max-w-3xl mx-auto group mb-20">
                    <Card className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-blue-500/5 to-cyan-500/10 border border-blue-500/20 text-center hover:border-blue-500/40 transition-colors">
                        <Code2 className="w-12 h-12 text-blue-400 mx-auto mb-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground group-hover:text-blue-400 transition-colors">Ready to vibe code?</h3>
                        <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
                            Check out the documentation to view the available templates (SaaS Starter, AI Chat, Marketing) and learn how to optimize your cursorrules.
                        </p>
                        <span className="inline-flex items-center gap-2 font-semibold text-blue-400">
                            View Templates <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
