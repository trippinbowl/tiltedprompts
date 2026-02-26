import Link from "next/link";
import { Server, Mic2, Code2, FlaskConical, ArrowRight, Zap, Globe, Shield } from "lucide-react";

export const metadata = {
    title: "Documentation — TiltedPrompts",
    description: "Complete documentation for TiltedPrompts — the agentic coding platform. MCP servers, voice AI, code templates, and automation workflows.",
};

const products = [
    {
        name: "TiltedMCP",
        suffix: "MCP",
        href: "/docs/tilted-mcp",
        icon: Server,
        gradient: "from-indigo-400 to-violet-400",
        borderColor: "hover:border-indigo-500/30",
        description: "Deploy, host, and discover MCP servers. Production-ready endpoints with built-in auth, monitoring, and marketplace.",
        features: ["CLI Scaffolder", "Edge Deployment", "OAuth 2.1 Auto-Inject", "Marketplace"],
    },
    {
        name: "TiltedVoice",
        suffix: "Voice",
        href: "/docs/tilted-voice",
        icon: Mic2,
        gradient: "from-emerald-400 to-teal-300",
        borderColor: "hover:border-emerald-500/30",
        description: "Voice-to-text platform with two packages — Whisper for global, Sarvam AI for 22 Indian languages.",
        features: ["On-Device Whisper", "22 Indian Languages", "Voice Agents", "WhatsApp Calling"],
    },
    {
        name: "TiltedCode",
        suffix: "Code",
        href: "/docs/tilted-code",
        icon: Code2,
        gradient: "from-blue-400 to-cyan-400",
        borderColor: "hover:border-blue-500/30",
        description: "Production-ready Next.js templates pre-wired for AI coding agents. Ship faster with agent-optimized starters.",
        features: ["SaaS Starter", "AI Chat App", "Agent Context Files", "Pre-Wired MCP"],
    },
    {
        name: "The Laboratory",
        suffix: "Laboratory",
        href: "/docs/laboratory",
        icon: FlaskConical,
        gradient: "from-orange-400 to-rose-400",
        borderColor: "hover:border-orange-500/30",
        description: "Pre-built n8n workflows and WhatsApp automation for Indian MSMEs. Business automation in a box.",
        features: ["n8n Workflows", "WhatsApp Funnels", "CRM Automation", "UPI Payments"],
    },
];

const principles = [
    {
        icon: Zap,
        title: "Agent-First",
        description: "Every product is designed to be consumed by AI coding agents. Cursor, Claude Code, Windsurf — they all work with our tools natively.",
    },
    {
        icon: Globe,
        title: "India + Global",
        description: "We build for the Indian market first — UPI, WhatsApp, 22 languages — then extend globally. Local depth, global reach.",
    },
    {
        icon: Shield,
        title: "Production-Grade",
        description: "No toy demos. Every tool ships with OAuth, monitoring, error recovery, and SLAs. Built for real workloads from day one.",
    },
];

export default function DocsLandingPage() {
    return (
        <div>
            {/* Header */}
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                    </span>
                    v0.1 — Building in Public
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
                    Documentation
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                    TiltedPrompts is an agentic coding platform — we build the infrastructure
                    that makes AI agents more effective. MCP servers, voice AI, production templates,
                    and business automation.
                </p>
            </div>

            {/* Quick Start */}
            <div className="mb-16 p-6 rounded-2xl bg-secondary/30 border border-border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Quick Start</h2>
                    <Link
                        href="/docs/getting-started"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                        Full guide <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0 mt-0.5">
                            1
                        </span>
                        <div>
                            <p className="text-sm font-medium">Create your account</p>
                            <p className="text-xs text-muted-foreground">Sign up at tiltedprompts.com — free tier includes 3 MCP servers and 1K invocations/month.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0 mt-0.5">
                            2
                        </span>
                        <div>
                            <p className="text-sm font-medium">Scaffold your first MCP server</p>
                            <code className="text-xs font-mono bg-background/50 px-2 py-1 rounded mt-1 inline-block">
                                npx create-tilted-mcp my-server
                            </code>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0 mt-0.5">
                            3
                        </span>
                        <div>
                            <p className="text-sm font-medium">Deploy to the edge</p>
                            <code className="text-xs font-mono bg-background/50 px-2 py-1 rounded mt-1 inline-block">
                                tilted deploy
                            </code>
                            <p className="text-xs text-muted-foreground mt-1">Your server is live at <span className="font-mono">my-server.mcp.tiltedprompts.com</span> with OAuth built in.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Cards */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6">Products</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {products.map((product) => {
                        const Icon = product.icon;
                        return (
                            <Link
                                key={product.name}
                                href={product.href}
                                className={`group p-6 rounded-2xl bg-secondary/20 border border-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 ${product.borderColor}`}
                            >
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            {product.name.startsWith("Tilted") ? (
                                                <>
                                                    Tilted
                                                    <span className={`bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent`}>
                                                        {product.suffix}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    The{" "}
                                                    <span className={`bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent`}>
                                                        {product.suffix}
                                                    </span>
                                                </>
                                            )}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 ml-14">
                                    {product.features.map((f) => (
                                        <span
                                            key={f}
                                            className="text-xs px-2 py-0.5 rounded-full bg-white/[0.04] text-muted-foreground"
                                        >
                                            {f}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-1 mt-4 ml-14 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    Read documentation <ArrowRight className="w-3 h-3" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Architecture */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6">How It All Fits Together</h2>
                <div className="p-6 rounded-2xl bg-secondary/20 border border-border">
                    <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                        <div className="flex gap-3">
                            <Server className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                            <p>
                                <span className="text-foreground font-semibold">TiltedMCP</span> is the connective layer — it gives AI agents access to databases, APIs, and services through the Model Context Protocol.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Code2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <p>
                                <span className="text-foreground font-semibold">TiltedCode</span> is the starting point — production templates that come pre-wired with TiltedMCP so agents know how to extend them.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Mic2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <p>
                                <span className="text-foreground font-semibold">TiltedVoice</span> adds voice as an interface — dictate code globally with Whisper, or build Hindi/Tamil voice agents with the Indic package.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <FlaskConical className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                            <p>
                                <span className="text-foreground font-semibold">The Laboratory</span> is the business automation layer — n8n workflows and WhatsApp automation for Indian SMEs who need results, not code.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Principles */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6">Design Principles</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {principles.map((p) => {
                        const Icon = p.icon;
                        return (
                            <div key={p.title} className="p-5 rounded-2xl bg-secondary/20 border border-border">
                                <Icon className="w-5 h-5 text-primary mb-3" />
                                <h3 className="font-bold text-sm mb-1">{p.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Client Support */}
            <div className="p-6 rounded-2xl bg-secondary/20 border border-border">
                <h2 className="text-lg font-bold mb-3">Supported Clients</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    TiltedMCP servers work with every major AI coding client that supports the Model Context Protocol.
                </p>
                <div className="flex flex-wrap gap-3">
                    {["Cursor", "Claude Code", "Claude Desktop", "Windsurf", "VS Code Copilot", "Codex CLI"].map((client) => (
                        <span
                            key={client}
                            className="px-3 py-1.5 rounded-full bg-white/[0.04] text-sm text-muted-foreground border border-border"
                        >
                            {client}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
