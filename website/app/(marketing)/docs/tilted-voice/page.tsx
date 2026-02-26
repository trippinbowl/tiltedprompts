import Link from "next/link";
import { Mic2, ArrowRight, Terminal, Globe, Smartphone, Phone, Languages, Headphones, Cpu, Cloud } from "lucide-react";

export const metadata = {
    title: "TiltedVoice Documentation — TiltedPrompts",
    description: "Complete documentation for TiltedVoice — two voice AI packages: International (Whisper on-device) and Indic (Sarvam AI for 22 Indian languages).",
};

const indicLanguages = [
    "Hindi", "Tamil", "Telugu", "Bengali", "Kannada", "Marathi",
    "Gujarati", "Malayalam", "Punjabi", "Odia", "Assamese", "Urdu",
    "Maithili", "Sanskrit", "Sindhi", "Dogri", "Manipuri", "Bodo",
    "Santali", "Kashmiri", "Konkani", "Nepali",
];

const whisperModels = [
    { name: "tiny", size: "75 MB", speed: "~32x realtime", quality: "Drafts, quick notes", recommended: false },
    { name: "base", size: "142 MB", speed: "~16x realtime", quality: "Casual dictation", recommended: false },
    { name: "small", size: "466 MB", speed: "~6x realtime", quality: "Good accuracy", recommended: true },
    { name: "medium", size: "1.5 GB", speed: "~2x realtime", quality: "High accuracy", recommended: false },
    { name: "large-v3", size: "3.1 GB", speed: "~1x realtime", quality: "Maximum accuracy", recommended: false },
];

export default function TiltedVoiceDocsPage() {
    return (
        <div>
            {/* Header */}
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-4">
                    <Mic2 className="w-3 h-3" /> Voice AI Platform
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
                    Tilted<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Voice</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                    Voice-to-text platform with two packages — one for global usage via on-device Whisper,
                    and one for Indian languages via Sarvam AI cloud. Two packages, one mission: voice everywhere.
                </p>
            </div>

            {/* Package Overview */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Two Packages</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-secondary/20 border border-border border-l-2 border-l-emerald-500">
                        <div className="flex items-center gap-2 mb-3">
                            <Cpu className="w-5 h-5 text-emerald-400" />
                            <h3 className="text-lg font-bold">International</h3>
                        </div>
                        <code className="text-xs font-mono text-emerald-300 bg-background/50 px-2 py-1 rounded">
                            @tiltedprompts/voice
                        </code>
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                            On-device transcription via OpenAI Whisper. Zero cloud dependency.
                            99 languages. Sub-500ms latency. Fully offline.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {["On-Device", "99 Languages", "Offline", "GPU Accelerated"].map((tag) => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-secondary/20 border border-border border-l-2 border-l-teal-400">
                        <div className="flex items-center gap-2 mb-3">
                            <Cloud className="w-5 h-5 text-teal-400" />
                            <h3 className="text-lg font-bold">Indic</h3>
                        </div>
                        <code className="text-xs font-mono text-teal-300 bg-background/50 px-2 py-1 rounded">
                            @tiltedprompts/voice-indic
                        </code>
                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                            Cloud transcription via Sarvam AI. 22 Indian languages.
                            Code-switching support. Voice agent builder.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {["22 Languages", "Code-Switching", "Voice Agents", "WhatsApp"].map((tag) => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── INTERNATIONAL PACKAGE ─── */}
            <div className="mb-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wider px-3">Package A: International</span>
                <div className="h-px flex-1 bg-border" />
            </div>

            {/* International Features */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">@tiltedprompts/voice</h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    On-device transcription powered by OpenAI Whisper. Runs entirely on your machine with Metal GPU
                    acceleration on Apple Silicon. No audio data leaves your device.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {[
                        { icon: Cpu, title: "On-Device Processing", desc: "Whisper runs locally. No cloud dependency, no latency penalty, no privacy concerns." },
                        { icon: Headphones, title: "Push-to-Talk & Toggle", desc: "Two recording modes — hold-to-speak for quick commands, or toggle on/off for longer dictation." },
                        { icon: Globe, title: "99 Languages", desc: "Full Whisper language coverage including CJK, Arabic, Hebrew, and all European languages." },
                        { icon: Languages, title: "Custom Dictionary", desc: "Add domain-specific words, project names, and technical terms for higher accuracy." },
                    ].map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div key={feature.title} className="p-5 rounded-2xl bg-secondary/20 border border-border">
                                <Icon className="w-5 h-5 text-emerald-400 mb-3" />
                                <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Whisper Models Table */}
                <h3 className="text-lg font-bold mb-3">Whisper Models</h3>
                <div className="rounded-2xl overflow-hidden border border-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-secondary/40 border-b border-border">
                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Model</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Size</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Speed</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Best For</th>
                                </tr>
                            </thead>
                            <tbody>
                                {whisperModels.map((model) => (
                                    <tr key={model.name} className={`border-b border-border/50 ${model.recommended ? "bg-emerald-500/5" : ""}`}>
                                        <td className="px-4 py-2.5 font-mono text-sm">
                                            {model.name}
                                            {model.recommended && (
                                                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                                                    recommended
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2.5 text-muted-foreground">{model.size}</td>
                                        <td className="px-4 py-2.5 text-muted-foreground">{model.speed}</td>
                                        <td className="px-4 py-2.5 text-muted-foreground">{model.quality}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* International Installation */}
            <section className="mb-12">
                <h3 className="text-lg font-bold mb-3">Installation</h3>
                <div className="rounded-2xl overflow-hidden border border-border">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/40 border-b border-border">
                        <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-mono text-muted-foreground">Terminal</span>
                    </div>
                    <div className="p-4 bg-background/50 font-mono text-sm space-y-4">
                        <div>
                            <p className="text-muted-foreground"># Desktop app (macOS, Windows, Linux)</p>
                            <p><span className="text-emerald-400">brew</span> install --cask tilted-voice  <span className="text-muted-foreground"># macOS</span></p>
                        </div>
                        <div>
                            <p className="text-muted-foreground"># npm package for developers</p>
                            <p><span className="text-emerald-400">npm</span> install @tiltedprompts/voice</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground"># Quick CLI usage</p>
                            <p><span className="text-emerald-400">npx</span> tilted-voice --model small --lang en</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── INDIC PACKAGE ─── */}
            <div className="mb-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wider px-3">Package B: Indic</span>
                <div className="h-px flex-1 bg-border" />
            </div>

            {/* Indic Features */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">@tiltedprompts/voice-indic</h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    India-specific voice AI powered by Sarvam AI. Build multilingual voice agents that work over
                    phone calls, WhatsApp, and web. The only managed platform for Indian-language voice automation.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {[
                        { icon: Languages, title: "22 Indian Languages", desc: "Hindi, Tamil, Telugu, Bengali, Kannada, Marathi, Gujarati, Malayalam, Punjabi, Odia, and 12 more." },
                        { icon: Mic2, title: "Code-Switching", desc: "Handles Hinglish, Tanglish, and other mixed-language conversations natively. No pre-selection needed." },
                        { icon: Phone, title: "Telephony Integration", desc: "Exotel for Indian phone numbers (toll-free, local DID). Inbound call routing to voice agents." },
                        { icon: Smartphone, title: "WhatsApp Business Calling", desc: "Voice agents on WhatsApp via Gupshup BSP. Same agent handles text and voice calls." },
                    ].map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div key={feature.title} className="p-5 rounded-2xl bg-secondary/20 border border-border">
                                <Icon className="w-5 h-5 text-teal-400 mb-3" />
                                <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Language Grid */}
                <h3 className="text-lg font-bold mb-3">Supported Indian Languages</h3>
                <div className="p-5 rounded-2xl bg-secondary/20 border border-border mb-6">
                    <div className="flex flex-wrap gap-2">
                        {indicLanguages.map((lang) => (
                            <span key={lang} className="text-xs px-3 py-1 rounded-full bg-white/[0.04] text-muted-foreground border border-border">
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Voice Agent Pipeline */}
            <section className="mb-12">
                <h3 className="text-lg font-bold mb-3">Voice Agent Pipeline</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    The Indic package provides a complete voice agent pipeline — speech-to-text, language model
                    processing, and text-to-speech — all optimized for sub-800ms end-to-end latency.
                </p>
                <div className="p-5 rounded-2xl bg-secondary/20 border border-border">
                    <div className="flex flex-col md:flex-row items-center gap-3 text-sm">
                        <div className="p-3 rounded-xl bg-background/50 border border-border text-center flex-1 w-full">
                            <p className="font-mono text-xs text-teal-300 mb-1">Sarvam Saaras v3</p>
                            <p className="text-muted-foreground text-xs">Speech → Text</p>
                        </div>
                        <span className="text-muted-foreground hidden md:block">→</span>
                        <span className="text-muted-foreground md:hidden">↓</span>
                        <div className="p-3 rounded-xl bg-background/50 border border-border text-center flex-1 w-full">
                            <p className="font-mono text-xs text-violet-300 mb-1">GPT-4.1-mini</p>
                            <p className="text-muted-foreground text-xs">Reasoning</p>
                        </div>
                        <span className="text-muted-foreground hidden md:block">→</span>
                        <span className="text-muted-foreground md:hidden">↓</span>
                        <div className="p-3 rounded-xl bg-background/50 border border-border text-center flex-1 w-full">
                            <p className="font-mono text-xs text-teal-300 mb-1">Sarvam Bulbul v3</p>
                            <p className="text-muted-foreground text-xs">Text → Speech</p>
                        </div>
                    </div>
                    <p className="text-center text-xs text-muted-foreground/60 mt-3">
                        End-to-end latency: &lt;800ms via WebRTC (LiveKit)
                    </p>
                </div>
            </section>

            {/* Indic Installation */}
            <section className="mb-12">
                <h3 className="text-lg font-bold mb-3">Installation</h3>
                <div className="rounded-2xl overflow-hidden border border-border">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/40 border-b border-border">
                        <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-mono text-muted-foreground">Terminal</span>
                    </div>
                    <div className="p-4 bg-background/50 font-mono text-sm space-y-4">
                        <div>
                            <p className="text-muted-foreground"># npm package</p>
                            <p><span className="text-emerald-400">npm</span> install @tiltedprompts/voice-indic</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground"># Python package</p>
                            <p><span className="text-emerald-400">pip</span> install tiltedvoice</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground"># REST API</p>
                            <p>curl -X POST https://api.tiltedprompts.com/voice/v1/transcribe \</p>
                            <p className="ml-4">-H <span className="text-amber-300">&quot;Authorization: Bearer $TILTED_API_KEY&quot;</span> \</p>
                            <p className="ml-4">-F <span className="text-amber-300">&quot;audio=@recording.wav&quot;</span> \</p>
                            <p className="ml-4">-F <span className="text-amber-300">&quot;language=hi&quot;</span></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Stack Comparison */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Tech Stack Comparison</h2>
                <div className="rounded-2xl overflow-hidden border border-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-secondary/40 border-b border-border">
                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Layer</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">International</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-bold text-teal-400 uppercase tracking-wider">Indic</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    { layer: "STT", intl: "Whisper (on-device)", indic: "Sarvam Saaras v3 (cloud)" },
                                    { layer: "TTS", intl: "— (dictation only)", indic: "Sarvam Bulbul v3 (cloud)" },
                                    { layer: "LLM", intl: "— (no reasoning)", indic: "GPT-4.1-mini (agent brain)" },
                                    { layer: "Transport", intl: "Local audio capture", indic: "WebRTC via LiveKit" },
                                    { layer: "Runtime", intl: "Rust/Tauri (desktop)", indic: "Python FastAPI (backend)" },
                                    { layer: "Telephony", intl: "—", indic: "Exotel (India) + Twilio (global)" },
                                    { layer: "WhatsApp", intl: "—", indic: "Gupshup BSP" },
                                ].map((row) => (
                                    <tr key={row.layer} className="border-b border-border/50">
                                        <td className="px-4 py-2.5 font-medium text-foreground">{row.layer}</td>
                                        <td className="px-4 py-2.5 text-muted-foreground">{row.intl}</td>
                                        <td className="px-4 py-2.5 text-muted-foreground">{row.indic}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Next Steps */}
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
