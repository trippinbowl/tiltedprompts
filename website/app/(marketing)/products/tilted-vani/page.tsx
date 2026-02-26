"use client";

import { Languages, Mic, Globe, Phone, Smartphone, ArrowRight, Download, FileText } from "lucide-react";
import Link from "next/link";
import { DemoVideoPlaceholder } from "@/components/ui/demo-video-placeholder";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const hindiExamples = [
    {
        audio: '"Main aaj bazaar jaana chahta hoon"',
        hindi: "मैं आज बाज़ार जाना चाहता हूँ",
        english: "I want to go to the market today",
    },
    {
        audio: '"Mujhe teen kilo aloo aur ek kilo tamatar chahiye"',
        hindi: "मुझे तीन किलो आलू और एक किलो टमाटर चाहिए",
        english: "I need three kilograms of potatoes and one kilogram of tomatoes",
    },
    {
        audio: '"Kya aap meri madad kar sakte hain?"',
        hindi: "क्या आप मेरी मदद कर सकते हैं?",
        english: "Can you help me?",
    },
];

export default function TiltedVaniPage() {
    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4">
                {/* 1. Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                        <Languages className="w-8 h-8 text-amber-500" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tight mb-4">
                        Tilted<span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Vani</span>
                    </h1>
                    <p className="text-lg text-muted-foreground/60 mb-6 font-mono uppercase tracking-widest">
                        वाणी — voice, speech, expression
                    </p>
                    <p className="text-2xl text-muted-foreground font-light mb-6">
                        Hindi voice-to-text with automatic English translation. Pure Devanagari output.
                    </p>
                    <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Powered by Sarvam AI. Speak in Hindi, get शुद्ध हिंदी text output instantly, not Romanized Hinglish. Built for the next billion users in Bharat.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Button className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full shadow-lg shadow-amber-500/25">
                            <Download className="w-5 h-5 mr-2" />
                            Use in Browser
                        </Button>
                        <Link href="/docs/tilted-vani">
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

                {/* 3. Dual Output Demo */}
                <div className="mb-32 max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">Dual Output Architecture</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">One audio stream in. Two perfected text streams out. Ideal for generating subtitles, documentation, and dual-language agent contexts.</p>
                    </div>
                    <div className="space-y-6">
                        {hindiExamples.map((example, i) => (
                            <Card key={i} className="p-6 md:p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                                        <Mic className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <span className="text-sm md:text-base text-muted-foreground/80 font-mono tracking-tight">{example.audio}</span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                                        <p className="text-[10px] uppercase tracking-widest text-amber-500/80 font-bold mb-3">Hindi Output (Devanagari)</p>
                                        <p className="text-xl md:text-2xl font-serif">{example.hindi}</p>
                                    </div>
                                    <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                                        <p className="text-[10px] uppercase tracking-widest text-blue-400/80 font-bold mb-3">English Translation</p>
                                        <p className="text-lg text-muted-foreground">{example.english}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 3. Differentiator */}
                <div className="mb-32 max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">Hindi, Not Hinglish</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Standard transcription models output Romanized Hindi, which breaks downstream search and NLP tasks. We fix this at the infrastructure level.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-8 md:p-10 rounded-3xl bg-red-500/5 border border-red-500/20">
                            <p className="text-xs uppercase tracking-widest text-red-400/80 font-bold mb-6">Standard Transcribers Result</p>
                            <p className="font-mono text-lg md:text-xl text-muted-foreground mb-4">
                                &quot;Main aaj bazaar jaana chahta hoon&quot;
                            </p>
                            <p className="text-sm text-red-400/80">Romanized Hinglish breaks localization pipelines.</p>
                        </Card>
                        <Card className="p-8 md:p-10 rounded-3xl bg-emerald-500/5 border border-emerald-500/20">
                            <p className="text-xs uppercase tracking-widest text-emerald-400/80 font-bold mb-6">TiltedVani Result</p>
                            <p className="text-2xl md:text-3xl font-serif text-foreground mb-4">
                                मैं आज बाज़ार जाना चाहता हूँ
                            </p>
                            <p className="text-sm text-emerald-400/80">Pure Devanagari script ready for production.</p>
                        </Card>
                    </div>
                </div>

                {/* 4. Core Features Grid */}
                <div className="mb-32">
                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300">
                            <Languages className="w-10 h-10 text-amber-500 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Pure Devanagari</h3>
                            <p className="text-muted-foreground leading-relaxed">Proper Hindi text output in Devanagari script. Numbers, dates, and technical terms handled correctly with transliteration options.</p>
                        </Card>
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300">
                            <Globe className="w-10 h-10 text-blue-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Auto-Translation</h3>
                            <p className="text-muted-foreground leading-relaxed">Every Hindi transcription comes with an accurate English translation. Dual output for documentation, subtitles, and content creation.</p>
                        </Card>
                        <Card className="p-8 rounded-2xl bg-surface/30 border border-border hover:-translate-y-1 transition-all duration-300">
                            <Phone className="w-10 h-10 text-orange-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Voice Agents</h3>
                            <p className="text-muted-foreground leading-relaxed">Build Hindi voice agents for phone calls and WhatsApp. Exotel telephony + Gupshup WhatsApp Business API integration ready.</p>
                        </Card>
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="max-w-4xl mx-auto mb-32 p-10 rounded-[2rem] bg-secondary/20 border border-border/50 text-center">
                    <h3 className="text-sm uppercase tracking-widest font-bold mb-8 text-muted-foreground">Powered By Enterprise Infrastructure</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {["Sarvam AI Saaras v3", "Sarvam AI Mayura v2", "FastAPI", "WebRTC (LiveKit)", "AWS Mumbai", "Exotel", "Gupshup"].map((tech) => (
                            <span key={tech} className="px-4 py-2 rounded-full bg-white/[0.04] text-sm text-muted-foreground border border-border hover:text-foreground transition-colors cursor-default">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Cross-link to TiltedVoice */}
                <Link href="/products/tilted-voice" className="block max-w-3xl mx-auto group">
                    <Card className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-teal-500/10 border border-emerald-500/20 text-center hover:border-emerald-500/40 transition-colors">
                        <Globe className="w-12 h-12 text-emerald-400 mx-auto mb-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground group-hover:text-emerald-400 transition-colors">Building for an international English audience?</h3>
                        <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
                            TiltedVoice runs Whisper entirely on your local hardware. Infinite usage, zero cloud data transfer, and complete autonomy.
                        </p>
                        <span className="inline-flex items-center gap-2 font-semibold text-emerald-400">
                            Explore TiltedVoice <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
