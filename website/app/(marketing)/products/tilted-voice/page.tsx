"use client";

import { Mic, Globe, Cpu, Headphones, Download, Palette, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { DemoVideoPlaceholder } from "@/components/ui/demo-video-placeholder";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TiltedVoicePage() {
    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4">
                {/* 1. Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                        <Mic className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tight mb-8">
                        Tilted<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Voice</span>
                    </h1>
                    <p className="text-2xl text-muted-foreground font-light mb-6">
                        Ship voice agents that run entirely on-device. Zero cloud storage. Zero latency.
                    </p>
                    <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                        A dedicated Windows desktop application powered by faster-whisper. Transform speech to text globally with 4 hardware-optimized models and auto-paste capabilities.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Button className="h-14 px-8 text-base font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/25">
                            <Download className="w-5 h-5 mr-2" />
                            Download for Windows (.exe)
                        </Button>
                        <Link href="/docs/tilted-voice">
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
                        <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">Uncompromising Privacy & Speed</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Engineered for seamless dictation and voice commands without sacrificing your local hardware advantages.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300">
                            <Cpu className="w-10 h-10 text-emerald-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">4 Whisper Models</h3>
                            <p className="text-muted-foreground leading-relaxed">Choose your balance of speed and accuracy. Select from Tiny (75MB) for instant dictation, up to Medium (1.5GB) for studio-grade transcription.</p>
                        </Card>
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300">
                            <Headphones className="w-10 h-10 text-emerald-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">3 Hardware Modes</h3>
                            <p className="text-muted-foreground leading-relaxed">Hold a key to record (Push-to-Talk), tap to Toggle, or let Auto-Listen detect your voice using energy-based Voice Activity Detection.</p>
                        </Card>
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300">
                            <Globe className="w-10 h-10 text-emerald-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Zero UI Friction</h3>
                            <p className="text-muted-foreground leading-relaxed">Global hotkeys (`Ctrl+Shift+Space`) allow you to dictate from anywhere. The transcription automatically pastes into your active window.</p>
                        </Card>
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300 lg:col-start-2 lg:col-span-2 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <Palette className="w-12 h-12 text-emerald-400 shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold mb-3">7 Premium UI Themes</h3>
                                <p className="text-muted-foreground leading-relaxed mb-4">A tool you use every day should look phenomenal. Choose between Midnight, Nord Aurora, Emerald Night, Sunset Blaze, Rose Quartz, Arctic, and Cyberpunk to match your IDE.</p>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* 4. Cross-link to Vani */}
                <Link href="/products/tilted-vani" className="block max-w-3xl mx-auto group">
                    <Card className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-amber-500/5 to-orange-500/10 border border-amber-500/20 text-center hover:border-amber-500/40 transition-colors">
                        <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground group-hover:text-amber-500 transition-colors">Looking for native Hindi mapping?</h3>
                        <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
                            TiltedVani uses Sarvam AI to provide pure Devanagari output with simultaneous English translations. Built specifically for Bharat.
                        </p>
                        <span className="inline-flex items-center gap-2 font-semibold text-amber-500">
                            Explore TiltedVani <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
