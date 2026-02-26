"use client";

import { Workflow, MessageSquareText, TrendingUp, Smartphone, IndianRupee, ArrowRight, Download, FileText } from "lucide-react";
import Link from "next/link";
import { DemoVideoPlaceholder } from "@/components/ui/demo-video-placeholder";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LaboratoryPage() {
    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4">
                {/* 1. Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                        <Workflow className="w-8 h-8 text-orange-500" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tight mb-6">
                        The <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">Laboratory</span>
                    </h1>
                    <p className="text-2xl text-muted-foreground font-light mb-6">
                        Pre-built n8n workflows and WhatsApp automation for Indian MSMEs. Business automation in a box.
                    </p>
                    <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Importable workflow files, Razorpay + UPI payments, Instagram DM capture, and CRM pipelines. No writing code, just importing zip files and watching your business run itself.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Button className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-full shadow-lg shadow-orange-500/25">
                            <Download className="w-5 h-5 mr-2" />
                            Download Workflows
                        </Button>
                        <Link href="/docs/laboratory">
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
                        <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">Click to Automate</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">We spent hundreds of hours building the perfect lead-capture funnels so you can deploy them in exactly three clicks.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300">
                            <MessageSquareText className="w-10 h-10 text-rose-500 mb-6" />
                            <h3 className="text-xl font-bold mb-3">WhatsApp Native</h3>
                            <p className="text-muted-foreground leading-relaxed">Marketing pipelines that flow directly into WhatsApp Business. Turn passive Instagram intent into an immediate, high-conversion conversation.</p>
                        </Card>
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300">
                            <Workflow className="w-10 h-10 text-orange-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Deployable Workflows</h3>
                            <p className="text-muted-foreground leading-relaxed">Importable n8n workflow files that provision full CRM to WhatsApp pipelines. You don&apos;t need to be an engineer to automate your sales.</p>
                        </Card>
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300">
                            <TrendingUp className="w-10 h-10 text-amber-500 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Built for India</h3>
                            <p className="text-muted-foreground leading-relaxed">Native UPI payments via Razorpay, automated GST-compliant invoicing, and workflows designed explicitly for how Indian businesses operate.</p>
                        </Card>
                    </div>
                </div>

                {/* 4. Cross-link to Documentation */}
                <Link href="/docs/laboratory" className="block max-w-3xl mx-auto group mb-20">
                    <Card className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-orange-500/5 to-rose-500/10 border border-orange-500/20 text-center hover:border-orange-500/40 transition-colors">
                        <Smartphone className="w-12 h-12 text-orange-400 mx-auto mb-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground group-hover:text-orange-400 transition-colors">Ready to automate your MSME?</h3>
                        <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
                            Read the documentation to see the exact n8n node structure for our Instagram DM to WhatsApp checkout funnel.
                        </p>
                        <span className="inline-flex items-center gap-2 font-semibold text-orange-400">
                            View Documentation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
