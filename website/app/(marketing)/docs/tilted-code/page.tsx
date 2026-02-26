import Link from "next/link";
import { Code2, ArrowRight, Terminal, Layout, MessageSquare, Mic2, Server, FlaskConical, FolderTree, Blocks, Paintbrush, Rocket } from "lucide-react";

export const metadata = {
    title: "TiltedCode Documentation — TiltedPrompts",
    description: "Production-ready Next.js templates pre-wired for AI coding agents. Ship faster with agent-optimized starters.",
};

const templates = [
    {
        name: "SaaS Starter",
        icon: Layout,
        description: "Complete SaaS foundation with authentication, billing, dashboard, and landing page. Pre-wired with Supabase, Stripe, and Tailwind.",
        includes: ["Auth (Supabase)", "Billing (Stripe)", "Dashboard", "Landing Page", "Email Templates", "Admin Panel"],
        command: "npx create-tilted-app --template saas",
    },
    {
        name: "AI Chat App",
        icon: MessageSquare,
        description: "Multi-model AI chat interface with streaming, conversation memory, and model switching. Supports OpenAI, Anthropic, and local models.",
        includes: ["Multi-Model Chat", "Streaming Responses", "Conversation History", "Model Switching", "RAG Pipeline", "File Uploads"],
        command: "npx create-tilted-app --template ai-chat",
    },
    {
        name: "Voice Agent App",
        icon: Mic2,
        description: "Full voice agent UI with TiltedVoice integration. Real-time transcription, conversation display, and agent control panel.",
        includes: ["Voice Recording UI", "TiltedVoice Integration", "Transcription Display", "Agent Controls", "Call History", "Multi-Language"],
        command: "npx create-tilted-app --template voice-agent",
    },
    {
        name: "MCP Dashboard",
        icon: Server,
        description: "Admin panel for managing MCP servers. Server list, invocation logs, metrics charts, and deployment controls.",
        includes: ["Server Management", "Invocation Logs", "Metrics Dashboard", "Deploy Controls", "User Management", "API Key Management"],
        command: "npx create-tilted-app --template mcp-dashboard",
    },
    {
        name: "n8n + WhatsApp",
        icon: FlaskConical,
        description: "Automation stack for the Indian market. WhatsApp Business integration, n8n workflow triggers, and CRM pipeline.",
        includes: ["WhatsApp Bot", "n8n Webhooks", "Lead Funnel", "CRM Pipeline", "UPI Payments", "Analytics"],
        command: "npx create-tilted-app --template whatsapp-automation",
    },
];

const templateIncludes = [
    {
        icon: FolderTree,
        title: "Agent Context Files",
        description: "Pre-built .cursorrules and .claude configuration files that give AI agents deep understanding of the project structure, conventions, and how to extend it.",
    },
    {
        icon: Blocks,
        title: "Pre-Wired MCP",
        description: "Every template comes with TiltedMCP server connections already configured. Agents can query databases, send messages, and manage resources from day one.",
    },
    {
        icon: Paintbrush,
        title: "Design System",
        description: "Tailwind-based design system matching TiltedPrompts brand language. Dark-first, responsive, accessible. Consistent tokens across all templates.",
    },
    {
        icon: Rocket,
        title: "Deploy Scripts",
        description: "One-command deployment to Vercel or Cloudflare. CI/CD pipelines pre-configured. Environment variable management built in.",
    },
];

export default function TiltedCodeDocsPage() {
    return (
        <div>
            {/* Header */}
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-4">
                    <Code2 className="w-3 h-3" /> Agentic Code Templates
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
                    Tilted<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Code</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                    Production-ready Next.js templates pre-wired for AI coding agents. Not a competing agent —
                    a set of starter kits that make AI agents more effective at building real products.
                </p>
            </div>

            {/* Philosophy */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Why Agent-Optimized Templates?</h2>
                <div className="p-6 rounded-2xl bg-secondary/20 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>
                        AI coding agents like Cursor, Claude Code, and Windsurf are transforming how software gets built.
                        But they work best when they understand the project they&apos;re extending.
                    </p>
                    <p>
                        TiltedCode templates come with rich context files that teach agents the project&apos;s architecture,
                        naming conventions, API patterns, and how to add new features. The agent doesn&apos;t just generate code —
                        it generates code <em>that fits</em>.
                    </p>
                    <p>
                        Every template also ships with TiltedMCP connections pre-configured, so agents can immediately
                        interact with databases, send messages, and manage external services.
                    </p>
                </div>
            </section>

            {/* Quick Start */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
                <div className="rounded-2xl overflow-hidden border border-border">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/40 border-b border-border">
                        <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-mono text-muted-foreground">Terminal</span>
                    </div>
                    <div className="p-4 bg-background/50 font-mono text-sm space-y-4">
                        <div>
                            <p className="text-muted-foreground"># Interactive template picker</p>
                            <p><span className="text-emerald-400">npx</span> create-tilted-app</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground"># Or specify a template directly</p>
                            <p><span className="text-emerald-400">npx</span> create-tilted-app my-saas --template saas</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground"># Install and start</p>
                            <p><span className="text-emerald-400">cd</span> my-saas</p>
                            <p><span className="text-emerald-400">pnpm</span> install</p>
                            <p><span className="text-emerald-400">pnpm</span> dev</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Templates</h2>
                <div className="space-y-4">
                    {templates.map((template) => {
                        const Icon = template.icon;
                        return (
                            <div key={template.name} className="p-6 rounded-2xl bg-secondary/20 border border-border">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{template.description}</p>
                                        <code className="text-xs font-mono text-blue-300 bg-background/50 px-2 py-1 rounded">
                                            {template.command}
                                        </code>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {template.includes.map((item) => (
                                                <span key={item} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-muted-foreground">
                                                    {item}
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

            {/* What's Included */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Every Template Includes</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {templateIncludes.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.title} className="p-5 rounded-2xl bg-secondary/20 border border-border">
                                <Icon className="w-5 h-5 text-blue-400 mb-3" />
                                <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Project Structure */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Project Structure</h2>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Every template follows a consistent directory structure that AI agents understand:
                </p>
                <div className="rounded-2xl overflow-hidden border border-border">
                    <div className="px-4 py-2.5 bg-secondary/40 border-b border-border">
                        <span className="text-xs font-mono text-muted-foreground">my-tilted-app/</span>
                    </div>
                    <div className="p-4 bg-background/50 font-mono text-xs leading-loose text-muted-foreground">
                        <p><span className="text-blue-300">.cursorrules</span>          <span className="text-muted-foreground/50"># Agent context for Cursor</span></p>
                        <p><span className="text-blue-300">.claude/</span>              <span className="text-muted-foreground/50"># Agent context for Claude Code</span></p>
                        <p><span className="text-foreground">app/</span>                  <span className="text-muted-foreground/50"># Next.js App Router pages</span></p>
                        <p>  ├── <span className="text-foreground">(marketing)/</span>     <span className="text-muted-foreground/50"># Public pages with Navbar+Footer</span></p>
                        <p>  ├── <span className="text-foreground">dashboard/</span>       <span className="text-muted-foreground/50"># Authenticated dashboard</span></p>
                        <p>  └── <span className="text-foreground">api/</span>             <span className="text-muted-foreground/50"># API routes</span></p>
                        <p><span className="text-foreground">components/</span>           <span className="text-muted-foreground/50"># Shared UI components</span></p>
                        <p><span className="text-foreground">lib/</span>                  <span className="text-muted-foreground/50"># Utils, Supabase client, helpers</span></p>
                        <p><span className="text-foreground">mcp/</span>                  <span className="text-muted-foreground/50"># TiltedMCP server configs</span></p>
                        <p><span className="text-foreground">supabase/</span>             <span className="text-muted-foreground/50"># Migrations, seed data, RLS policies</span></p>
                        <p><span className="text-foreground">tailwind.config.ts</span>    <span className="text-muted-foreground/50"># Design system tokens</span></p>
                    </div>
                </div>
            </section>

            {/* Distribution */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Distribution</h2>
                <div className="p-5 rounded-2xl bg-secondary/20 border border-border">
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <Terminal className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-foreground">CLI (Open Source)</p>
                                <p className="text-xs text-muted-foreground"><code className="font-mono">npx create-tilted-app</code> — interactive scaffolder with all free templates.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Code2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-foreground">GitHub (Open Source)</p>
                                <p className="text-xs text-muted-foreground">Full source code for core templates. Fork, customize, contribute.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Layout className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-foreground">Members Area (Premium)</p>
                                <p className="text-xs text-muted-foreground">Advanced templates with premium features, priority support, and early access.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Next Steps */}
            <div className="flex items-center justify-between p-5 rounded-2xl bg-secondary/20 border border-border">
                <div>
                    <p className="text-sm font-bold">Next: The Laboratory</p>
                    <p className="text-xs text-muted-foreground">n8n workflows & WhatsApp automation</p>
                </div>
                <Link href="/docs/laboratory" className="flex items-center gap-1 text-sm text-primary hover:underline">
                    Continue <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
