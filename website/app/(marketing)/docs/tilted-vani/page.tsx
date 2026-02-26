import Link from "next/link";
import { Languages, ArrowRight, Terminal, Mic2, Phone, Smartphone, Globe } from "lucide-react";

export const metadata = {
    title: "TiltedVani Documentation — TiltedPrompts",
    description: "Hindi voice-to-text with automatic English translation. Pure Devanagari output, not Hinglish. Powered by Sarvam AI.",
};

export default function TiltedVaniDocsPage() {
    return (
        <div>
            {/* Header */}
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium mb-4">
                    <Languages className="w-3 h-3" /> Hindi Voice AI
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-black mb-2">
                    Tilted<span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Vani</span>
                </h1>
                <p className="text-sm text-muted-foreground/60 font-mono mb-4">वाणी — voice, speech, expression</p>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                    Hindi voice-to-text with automatic English translation. Speak in Hindi, get pure Devanagari text
                    output plus an accurate English translation. Built on Sarvam AI.
                </p>
            </div>

            {/* Key Differentiator */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Hindi, Not Hinglish</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20">
                        <p className="text-xs uppercase tracking-wider text-red-400/60 font-bold mb-2">Others Give You</p>
                        <p className="font-mono text-sm text-muted-foreground">&quot;Main aaj bazaar jaana chahta hoon&quot;</p>
                        <p className="text-xs text-red-400/60 mt-2">Romanized Hindi — useless for documentation, subtitles, or content</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                        <p className="text-xs uppercase tracking-wider text-emerald-400/60 font-bold mb-2">TiltedVani Gives You</p>
                        <p className="text-lg font-medium">मैं आज बाज़ार जाना चाहता हूँ</p>
                        <p className="text-sm text-blue-400 mt-1">&quot;I want to go to the market today&quot;</p>
                        <p className="text-xs text-emerald-400/60 mt-2">Pure Devanagari + English translation</p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                <div className="p-6 rounded-2xl bg-secondary/20 border border-border">
                    <div className="flex flex-col md:flex-row items-center gap-3 text-sm mb-4">
                        <div className="p-3 rounded-xl bg-background/50 border border-border text-center flex-1 w-full">
                            <p className="text-xs text-amber-400 font-mono mb-1">Hindi Audio</p>
                            <p className="text-muted-foreground text-xs">User speaks in Hindi</p>
                        </div>
                        <span className="text-muted-foreground hidden md:block">→</span>
                        <span className="text-muted-foreground md:hidden">↓</span>
                        <div className="p-3 rounded-xl bg-background/50 border border-border text-center flex-1 w-full">
                            <p className="text-xs text-amber-400 font-mono mb-1">Sarvam Saaras v3</p>
                            <p className="text-muted-foreground text-xs">Speech → Devanagari text</p>
                        </div>
                        <span className="text-muted-foreground hidden md:block">→</span>
                        <span className="text-muted-foreground md:hidden">↓</span>
                        <div className="p-3 rounded-xl bg-background/50 border border-border text-center flex-1 w-full">
                            <p className="text-xs text-blue-400 font-mono mb-1">Sarvam Mayura v2</p>
                            <p className="text-muted-foreground text-xs">Hindi → English translation</p>
                        </div>
                        <span className="text-muted-foreground hidden md:block">→</span>
                        <span className="text-muted-foreground md:hidden">↓</span>
                        <div className="p-3 rounded-xl bg-background/50 border border-border text-center flex-1 w-full">
                            <p className="text-xs text-emerald-400 font-mono mb-1">Dual Output</p>
                            <p className="text-muted-foreground text-xs">Hindi + English text</p>
                        </div>
                    </div>
                    <p className="text-center text-xs text-muted-foreground/60">
                        End-to-end latency: &lt;500ms for transcription, &lt;800ms for transcription + translation
                    </p>
                </div>
            </section>

            {/* API Reference */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">API Reference</h2>

                {/* Transcribe endpoint */}
                <div className="mb-6 rounded-2xl overflow-hidden border border-border">
                    <div className="px-4 py-2.5 bg-secondary/40 border-b border-border flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">POST</span>
                        <span className="text-sm font-mono text-muted-foreground">/vani/v1/transcribe</span>
                    </div>
                    <div className="p-4 bg-background/50 font-mono text-xs leading-relaxed">
                        <p className="text-muted-foreground"># Transcribe Hindi audio with English translation</p>
                        <p className="mt-2">curl -X POST https://api.tiltedprompts.com/vani/v1/transcribe \</p>
                        <p className="ml-4">-H <span className="text-amber-300">&quot;Authorization: Bearer $TILTED_API_KEY&quot;</span> \</p>
                        <p className="ml-4">-F <span className="text-amber-300">&quot;audio=@recording.wav&quot;</span> \</p>
                        <p className="ml-4">-F <span className="text-amber-300">&quot;output=dual&quot;</span></p>
                        <p className="text-muted-foreground mt-3"># Response:</p>
                        <p>{"{"}</p>
                        <p className="ml-4"><span className="text-blue-300">&quot;hindi&quot;</span>: <span className="text-amber-300">&quot;मैं आज बाज़ार जाना चाहता हूँ&quot;</span>,</p>
                        <p className="ml-4"><span className="text-blue-300">&quot;english&quot;</span>: <span className="text-amber-300">&quot;I want to go to the market today&quot;</span>,</p>
                        <p className="ml-4"><span className="text-blue-300">&quot;confidence&quot;</span>: <span className="text-emerald-300">0.95</span>,</p>
                        <p className="ml-4"><span className="text-blue-300">&quot;duration_ms&quot;</span>: <span className="text-emerald-300">420</span></p>
                        <p>{"}"}</p>
                    </div>
                </div>

                {/* Translate endpoint */}
                <div className="mb-6 rounded-2xl overflow-hidden border border-border">
                    <div className="px-4 py-2.5 bg-secondary/40 border-b border-border flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">POST</span>
                        <span className="text-sm font-mono text-muted-foreground">/vani/v1/translate</span>
                    </div>
                    <div className="p-4 bg-background/50 font-mono text-xs leading-relaxed">
                        <p className="text-muted-foreground"># Translate Hindi text to English</p>
                        <p className="mt-2">curl -X POST https://api.tiltedprompts.com/vani/v1/translate \</p>
                        <p className="ml-4">-H <span className="text-amber-300">&quot;Authorization: Bearer $TILTED_API_KEY&quot;</span> \</p>
                        <p className="ml-4">-H <span className="text-amber-300">&quot;Content-Type: application/json&quot;</span> \</p>
                        <p className="ml-4">-d <span className="text-amber-300">&apos;{"{\"text\": \"मुझे तीन किलो आलू चाहिए\"}"}&apos;</span></p>
                    </div>
                </div>

                {/* Streaming endpoint */}
                <div className="rounded-2xl overflow-hidden border border-border">
                    <div className="px-4 py-2.5 bg-secondary/40 border-b border-border flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-400 font-mono font-bold">WS</span>
                        <span className="text-sm font-mono text-muted-foreground">/vani/v1/stream</span>
                    </div>
                    <div className="p-4 bg-background/50 text-sm text-muted-foreground">
                        <p>Real-time bidirectional WebSocket for live transcription. Send audio chunks, receive transcription events as they happen.</p>
                    </div>
                </div>
            </section>

            {/* Installation */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Installation</h2>
                <div className="rounded-2xl overflow-hidden border border-border">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/40 border-b border-border">
                        <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-mono text-muted-foreground">Terminal</span>
                    </div>
                    <div className="p-4 bg-background/50 font-mono text-sm space-y-4">
                        <div>
                            <p className="text-muted-foreground"># Python package</p>
                            <p><span className="text-emerald-400">pip</span> install tiltedvani</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground"># CLI usage — dual output</p>
                            <p><span className="text-emerald-400">tilted-vani</span> --output dual</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground"># Python API</p>
                            <p><span className="text-violet-300">from</span> tiltedvani <span className="text-violet-300">import</span> HindiTranscriber</p>
                            <p className="mt-1">transcriber = HindiTranscriber()</p>
                            <p>result = <span className="text-violet-300">await</span> transcriber.transcribe(audio)</p>
                            <p className="mt-1"><span className="text-emerald-400">print</span>(result.hindi)    <span className="text-muted-foreground"># मैं आज बाज़ार जाना चाहता हूँ</span></p>
                            <p><span className="text-emerald-400">print</span>(result.english)  <span className="text-muted-foreground"># I want to go to the market today</span></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Features</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { icon: Languages, title: "Pure Devanagari Output", desc: "Proper Hindi text in Devanagari script. Numbers, dates, and technical terms handled with transliteration options." },
                        { icon: Globe, title: "Auto English Translation", desc: "Every Hindi transcription comes with an accurate English translation via Sarvam Mayura v2." },
                        { icon: Phone, title: "Telephony Ready", desc: "Exotel integration for Indian phone numbers. Build Hindi voice agents that answer phone calls." },
                        { icon: Smartphone, title: "WhatsApp Voice", desc: "Voice agents on WhatsApp via Gupshup BSP. Same agent handles text and voice calls." },
                    ].map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div key={feature.title} className="p-5 rounded-2xl bg-secondary/20 border border-border">
                                <Icon className="w-5 h-5 text-amber-400 mb-3" />
                                <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Edge Cases */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Smart Handling</h2>
                <div className="p-5 rounded-2xl bg-secondary/20 border border-border">
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <span className="text-amber-400 shrink-0">→</span>
                            <div>
                                <p className="font-medium text-foreground">Number conversion</p>
                                <p className="text-xs text-muted-foreground">&quot;दो सौ पचास&quot; → 250 (configurable: Devanagari numerals or Arabic)</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-amber-400 shrink-0">→</span>
                            <div>
                                <p className="font-medium text-foreground">Date parsing</p>
                                <p className="text-xs text-muted-foreground">&quot;पंद्रह अगस्त&quot; → 15 August (ISO format in English output)</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-amber-400 shrink-0">→</span>
                            <div>
                                <p className="font-medium text-foreground">Punctuation intelligence</p>
                                <p className="text-xs text-muted-foreground">Automatic sentence boundaries, question marks, and Devanagari punctuation (। instead of .)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
                <div className="p-5 rounded-2xl bg-secondary/20 border border-border">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                            { label: "STT", value: "Sarvam AI Saaras v3" },
                            { label: "Translation", value: "Sarvam AI Mayura v2" },
                            { label: "Backend", value: "Python FastAPI" },
                            { label: "Streaming", value: "WebSocket + WebRTC (LiveKit)" },
                            { label: "Hosting", value: "AWS Mumbai (ap-south-1)" },
                            { label: "Telephony", value: "Exotel (India) + Twilio (intl)" },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-xs text-muted-foreground/60 uppercase tracking-wider">{item.label}</p>
                                <p className="text-foreground font-medium text-sm">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex items-center justify-between p-5 rounded-2xl bg-secondary/20 border border-border">
                <div>
                    <p className="text-sm font-bold">Next: TiltedCode</p>
                    <p className="text-xs text-muted-foreground">Agent-optimized production templates</p>
                </div>
                <Link href="/docs/tilted-code" className="flex items-center gap-1 text-sm text-primary hover:underline">
                    Continue <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
