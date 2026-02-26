import Link from "next/link";
import { Server, Zap, ShieldCheck, BarChart3, Globe, Terminal, ArrowRight, Database, FileText, Mail, Github, Sheet, Smartphone, Landmark } from "lucide-react";

export const metadata = {
    title: "TiltedMCP Documentation — TiltedPrompts",
    description: "Complete documentation for TiltedMCP — the managed platform for deploying, hosting, and discovering MCP servers. Vercel for MCP.",
};

const preBuiltServers = [
    {
        name: "@tiltedprompts/mcp-supabase",
        icon: Database,
        description: "Query, insert, and update across any Supabase project. Connection pooling, RLS-aware queries, and schema introspection.",
        tools: ["query_database", "insert_rows", "update_rows", "get_schema", "run_migration"],
    },
    {
        name: "@tiltedprompts/mcp-notion",
        icon: FileText,
        description: "Read and write Notion pages, databases, and blocks. Full CRUD with rich text support.",
        tools: ["search_pages", "read_page", "create_page", "update_database", "query_database"],
    },
    {
        name: "@tiltedprompts/mcp-gmail",
        icon: Mail,
        description: "Read inbox, send emails, manage labels. OAuth scoped to minimal permissions.",
        tools: ["read_inbox", "send_email", "search_messages", "manage_labels", "read_thread"],
    },
    {
        name: "@tiltedprompts/mcp-github",
        icon: Github,
        description: "Issues, pull requests, repo management. Works with both personal and org repos.",
        tools: ["list_issues", "create_issue", "create_pr", "review_pr", "manage_repo"],
    },
    {
        name: "@tiltedprompts/mcp-sheets",
        icon: Sheet,
        description: "Read and write Google Sheets data. Batch operations, formula support, named ranges.",
        tools: ["read_sheet", "write_cells", "create_sheet", "batch_update", "get_named_ranges"],
    },
    {
        name: "@tiltedprompts/mcp-whatsapp",
        icon: Smartphone,
        description: "Send and receive WhatsApp messages via Gupshup BSP. Template messages, media, and buttons.",
        tools: ["send_message", "send_template", "read_messages", "send_media", "manage_contacts"],
    },
    {
        name: "@tiltedprompts/mcp-indian-apis",
        icon: Landmark,
        description: "Indian government API integrations — GST verification, PAN lookup, UPI transaction status.",
        tools: ["verify_gst", "lookup_pan", "check_upi_status", "verify_aadhaar_masked", "ifsc_lookup"],
    },
];

const platformFeatures = [
    {
        icon: Terminal,
        title: "CLI-First Workflow",
        description: "Scaffold, develop, test, and deploy entirely from the terminal. No dashboard required for the core loop.",
    },
    {
        icon: ShieldCheck,
        title: "Auto-Injected OAuth 2.1",
        description: "Every deployed server gets OAuth 2.1 with PKCE via Auth0. Zero auth code from the developer — handled at the platform layer.",
    },
    {
        icon: Globe,
        title: "Edge Deployment",
        description: "Servers deploy to Cloudflare Workers — 300+ edge locations, zero cold starts, sub-50ms latency globally.",
    },
    {
        icon: BarChart3,
        title: "Built-In Monitoring",
        description: "Invocation logs, p50/p99 latency, error rates, and alerting. Know exactly how your servers perform in production.",
    },
    {
        icon: Zap,
        title: "Marketplace Distribution",
        description: "Publish servers to the marketplace. Other developers discover and connect with one click. Usage-based revenue share.",
    },
    {
        icon: Server,
        title: "Streamable HTTP Transport",
        description: "Production transport that supports bidirectional streaming. SSE fallback for legacy clients. Full MCP spec compliance.",
    },
];

export default function TiltedMCPDocsPage() {
    return (
        <div>
            {/* Header */}
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-4">
                    <Server className="w-3 h-3" /> Managed MCP Platform
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
                    Tilted<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">MCP</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                    A managed platform for deploying, hosting, and discovering MCP servers. Think &ldquo;Vercel for MCP.&rdquo;
                    Push your server code, get a production-ready endpoint with auth, monitoring, and marketplace distribution.
                </p>
            </div>

            {/* What is MCP */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">What is the Model Context Protocol?</h2>
                <div className="p-6 rounded-2xl bg-secondary/20 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>
                        MCP is an open standard created by Anthropic that provides a universal way for AI agents to connect
                        with external data sources and tools. It uses JSON-RPC 2.0 over Streamable HTTP transport.
                    </p>
                    <p>
                        Each MCP server exposes three primitives that agents can interact with:
                    </p>
                    <div className="grid md:grid-cols-3 gap-3 pt-2">
                        <div className="p-4 rounded-xl bg-background/50 border border-border">
                            <h3 className="text-foreground font-bold text-sm mb-1">Tools</h3>
                            <p className="text-xs">Actions the agent can take — query a database, send a message, create a resource.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-background/50 border border-border">
                            <h3 className="text-foreground font-bold text-sm mb-1">Resources</h3>
                            <p className="text-xs">Read-only data the agent can access — schemas, configurations, documentation.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-background/50 border border-border">
                            <h3 className="text-foreground font-bold text-sm mb-1">Prompts</h3>
                            <p className="text-xs">Reusable templates for consistent agent behavior across different contexts.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Two Sides */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Two Sides of the Product</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-secondary/20 border border-border">
                        <h3 className="text-lg font-bold mb-2">A. The Platform</h3>
                        <p className="text-sm text-muted-foreground mb-4">The hosting and deployment service for MCP servers.</p>
                        <div className="space-y-2">
                            {[
                                { cmd: "npx create-tilted-mcp", desc: "Scaffold a server in 60 seconds" },
                                { cmd: "tilted dev", desc: "Local dev server with hot reload" },
                                { cmd: "tilted deploy", desc: "Deploy to Cloudflare Workers edge" },
                                { cmd: "tilted logs", desc: "Tail invocation logs in real-time" },
                            ].map((item) => (
                                <div key={item.cmd} className="flex items-start gap-2">
                                    <code className="text-xs font-mono text-violet-300 bg-background/50 px-2 py-0.5 rounded shrink-0">{item.cmd}</code>
                                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-secondary/20 border border-border">
                        <h3 className="text-lg font-bold mb-2">B. Pre-Built Servers</h3>
                        <p className="text-sm text-muted-foreground mb-4">Ready-to-connect servers for popular services.</p>
                        <div className="space-y-2">
                            {["Supabase", "Notion", "Gmail", "GitHub", "Google Sheets", "WhatsApp", "Indian Gov APIs"].map((name) => (
                                <div key={name} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                    <span className="text-sm text-muted-foreground">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CLI Workflow */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">CLI Workflow</h2>
                <div className="rounded-2xl overflow-hidden border border-border">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/40 border-b border-border">
                        <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-mono text-muted-foreground">Terminal</span>
                    </div>
                    <div className="p-4 bg-background/50 font-mono text-sm space-y-4">
                        <div>
                            <p className="text-muted-foreground"># 1. Scaffold from template</p>
                            <p><span className="text-emerald-400">npx</span> create-tilted-mcp my-supabase-server --template supabase</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground"># 2. Install and configure</p>
                            <p><span className="text-emerald-400">cd</span> my-supabase-server</p>
                            <p><span className="text-emerald-400">cp</span> .env.example .env  <span className="text-muted-foreground"># Add your Supabase URL + key</span></p>
                        </div>
                        <div>
                            <p className="text-muted-foreground"># 3. Develop locally</p>
                            <p><span className="text-emerald-400">tilted</span> dev  <span className="text-muted-foreground"># Starts at http://localhost:8787/mcp</span></p>
                        </div>
                        <div>
                            <p className="text-muted-foreground"># 4. Deploy to production</p>
                            <p><span className="text-emerald-400">tilted</span> deploy</p>
                            <p className="text-emerald-400">  ✨ Live at: my-supabase-server.mcp.tiltedprompts.com</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Features */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Platform Features</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {platformFeatures.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div key={feature.title} className="p-5 rounded-2xl bg-secondary/20 border border-border">
                                <Icon className="w-5 h-5 text-indigo-400 mb-3" />
                                <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Pre-Built Servers */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Pre-Built Servers</h2>
                <div className="space-y-4">
                    {preBuiltServers.map((server) => {
                        const Icon = server.icon;
                        return (
                            <div key={server.name} className="p-5 rounded-2xl bg-secondary/20 border border-border">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm mb-1">
                                            <code className="font-mono text-violet-300">{server.name}</code>
                                        </h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{server.description}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {server.tools.map((tool) => (
                                                <span key={tool} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-muted-foreground">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Client Setup */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Client Setup</h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    TiltedMCP servers work with any client that supports MCP over Streamable HTTP transport.
                    Here&apos;s how to connect the most popular ones.
                </p>

                {/* Claude Desktop */}
                <div className="mb-4 rounded-2xl overflow-hidden border border-border">
                    <div className="px-4 py-2.5 bg-secondary/40 border-b border-border">
                        <span className="text-sm font-bold">Claude Desktop</span>
                    </div>
                    <div className="p-4 bg-background/50 font-mono text-xs leading-relaxed">
                        <p>{"{"}</p>
                        <p className="ml-4"><span className="text-blue-300">&quot;mcpServers&quot;</span>: {"{"}</p>
                        <p className="ml-8"><span className="text-blue-300">&quot;tilted-supabase&quot;</span>: {"{"}</p>
                        <p className="ml-12"><span className="text-blue-300">&quot;url&quot;</span>: <span className="text-amber-300">&quot;https://supabase.mcp.tiltedprompts.com/mcp&quot;</span>,</p>
                        <p className="ml-12"><span className="text-blue-300">&quot;transport&quot;</span>: <span className="text-amber-300">&quot;streamable-http&quot;</span></p>
                        <p className="ml-8">{"}"}</p>
                        <p className="ml-4">{"}"}</p>
                        <p>{"}"}</p>
                    </div>
                </div>

                {/* Cursor */}
                <div className="rounded-2xl overflow-hidden border border-border">
                    <div className="px-4 py-2.5 bg-secondary/40 border-b border-border">
                        <span className="text-sm font-bold">Cursor / VS Code</span>
                    </div>
                    <div className="p-4 bg-background/50 font-mono text-xs leading-relaxed">
                        <p className="text-muted-foreground">// .cursor/mcp.json or .vscode/mcp.json</p>
                        <p>{"{"}</p>
                        <p className="ml-4"><span className="text-blue-300">&quot;servers&quot;</span>: {"{"}</p>
                        <p className="ml-8"><span className="text-blue-300">&quot;tilted-supabase&quot;</span>: {"{"}</p>
                        <p className="ml-12"><span className="text-blue-300">&quot;url&quot;</span>: <span className="text-amber-300">&quot;https://supabase.mcp.tiltedprompts.com/mcp&quot;</span></p>
                        <p className="ml-8">{"}"}</p>
                        <p className="ml-4">{"}"}</p>
                        <p>{"}"}</p>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
                <div className="p-5 rounded-2xl bg-secondary/20 border border-border">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                            { label: "Runtime", value: "Cloudflare Workers (TypeScript)" },
                            { label: "SDK", value: "@modelcontextprotocol/sdk + FastMCP" },
                            { label: "Auth", value: "Auth0 OAuth 2.1 with PKCE" },
                            { label: "Dashboard", value: "Next.js + tRPC + Neon PostgreSQL" },
                            { label: "Analytics", value: "ClickHouse (high-volume)" },
                            { label: "Transport", value: "Streamable HTTP + SSE fallback" },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-xs text-muted-foreground/60 uppercase tracking-wider">{item.label}</p>
                                <p className="text-foreground font-medium text-sm">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Next Steps */}
            <div className="flex items-center justify-between p-5 rounded-2xl bg-secondary/20 border border-border">
                <div>
                    <p className="text-sm font-bold">Next: TiltedVoice</p>
                    <p className="text-xs text-muted-foreground">Voice AI — Whisper + Indian Languages</p>
                </div>
                <Link href="/docs/tilted-voice" className="flex items-center gap-1 text-sm text-primary hover:underline">
                    Continue <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
