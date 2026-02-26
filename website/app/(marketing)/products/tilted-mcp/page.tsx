"use client";

import { Server, Zap, ShieldCheck, Terminal, Database, ArrowRight, FileText, Download } from "lucide-react";
import Link from "next/link";
import { DemoVideoPlaceholder } from "@/components/ui/demo-video-placeholder";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TiltedMCPPage() {
    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4">
                {/* 1. Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                        <Server className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tight mb-8">
                        Tilted<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">MCP</span>
                    </h1>
                    <p className="text-2xl text-muted-foreground font-light mb-6">
                        Production-hardened Model Context Protocol servers delivered as a managed SaaS platform.
                    </p>
                    <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Vercel for MCP. Push your server code, get a production endpoint with authentication, benchmarking, and real-time monitoring instantly.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Button className="h-14 px-8 text-base font-semibold bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-500/25">
                            <Download className="w-5 h-5 mr-2" />
                            Deploy Server
                        </Button>
                        <Link href="/docs/tilted-mcp">
                            <Button variant="outline" className="h-14 px-8 text-base font-medium rounded-full border-border hover:bg-white/[0.04]">
                                <FileText className="w-5 h-5 mr-2" />
                                Read the Documentation
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* 2. Demo Video */}
                <div className="mb-32">
                    <DemoVideoPlaceholder />
                </div>

                {/* 3. Core Features Grid */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">Infrastructure Built for Agents</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Scale your AI operations without worrying about underlying server provisioning, auth headers, or connection pools.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300">
                            <Zap className="w-10 h-10 text-indigo-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Benchmarked Latency</h3>
                            <p className="text-muted-foreground leading-relaxed">Optimized connection pooling and caching layers that drastically outperform community reference servers. Every millisecond counts for AI agents.</p>
                        </Card>
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300">
                            <ShieldCheck className="w-10 h-10 text-indigo-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Production SLA</h3>
                            <p className="text-muted-foreground leading-relaxed">Guaranteed 99.9% uptime with built-in monitoring, rate limiting, and automated error recovery sequences out of the box.</p>
                        </Card>
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300">
                            <Server className="w-10 h-10 text-indigo-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Seamless Integrations</h3>
                            <p className="text-muted-foreground leading-relaxed">Pre-built standardized connections for databases, external APIs, and cloud services without writing integration boilerplate code.</p>
                        </Card>
                    </div>
                </div>

                {/* 4. Cross-link to Documentation */}
                <Link href="/docs/tilted-mcp" className="block max-w-3xl mx-auto group">
                    <Card className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-indigo-500/5 to-violet-500/10 border border-indigo-500/20 text-center hover:border-indigo-500/40 transition-colors">
                        <Terminal className="w-12 h-12 text-indigo-400 mx-auto mb-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground group-hover:text-indigo-400 transition-colors">Ready to define your tools?</h3>
                        <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
                            Read the developer documentation to see how to scaffold, deploy, and monitor your first Model Context Protocol server in under 2 minutes.
                        </p>
                        <span className="inline-flex items-center gap-2 font-semibold text-indigo-400">
                            View Documentation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
