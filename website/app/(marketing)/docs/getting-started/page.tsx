import Link from "next/link";
import { ArrowRight, Terminal, Key, Server, Mic2, Code2 } from "lucide-react";

export const metadata = {
    title: "Getting Started — TiltedPrompts Docs",
    description: "Set up your TiltedPrompts account, get API keys, and deploy your first MCP server in under 5 minutes.",
};

export default function GettingStartedPage() {
    return (
        <div>
            {/* Header */}
            <div className="mb-12">
                <p className="text-sm text-primary font-medium mb-2">Getting Started</p>
                <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
                    Setup & First Steps
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                    Go from zero to a live MCP server in under 5 minutes. This guide covers account creation,
                    API key generation, and your first deployment.
                </p>
            </div>

            {/* Prerequisites */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
                <div className="p-5 rounded-2xl bg-secondary/20 border border-border">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <strong className="text-foreground">Node.js 18+</strong> — Required for CLI tools and MCP server development
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <strong className="text-foreground">pnpm or npm</strong> — Package manager for installing dependencies
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <strong className="text-foreground">AI Coding Client</strong> — Cursor, Claude Code, Claude Desktop, or Windsurf
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <strong className="text-foreground">Python 3.10+</strong> — Only needed for TiltedVoice Indic package
                        </li>
                    </ul>
                </div>
            </section>

            {/* Step 1: Account */}
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        1
                    </span>
                    <h2 className="text-2xl font-bold">Create Your Account</h2>
                </div>
                <div className="ml-11 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Sign up at tiltedprompts.com to get access to the dashboard, API keys, and deployment tools.
                        The free tier includes everything you need to get started.
                    </p>
                    <div className="p-5 rounded-2xl bg-secondary/20 border border-border">
                        <h3 className="text-sm font-bold mb-3">Free Tier Includes</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> 3 MCP servers
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> 1,000 invocations/mo
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> 100 voice minutes/mo
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Community support
                            </div>
                        </div>
                    </div>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
                    >
                        Create Account <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Step 2: API Keys */}
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        2
                    </span>
                    <h2 className="text-2xl font-bold">Generate API Keys</h2>
                </div>
                <div className="ml-11 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Navigate to your dashboard and generate an API key. This key authenticates your CLI commands
                        and API requests.
                    </p>
                    <div className="rounded-2xl overflow-hidden border border-border">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/40 border-b border-border">
                            <Key className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs font-mono text-muted-foreground">Dashboard → Settings → API Keys</span>
                        </div>
                        <div className="p-4 bg-background/50 font-mono text-sm space-y-2">
                            <p className="text-muted-foreground"># Save your API key</p>
                            <p><span className="text-emerald-400">export</span> TILTED_API_KEY=<span className="text-amber-300">tp_live_xxxxxxxxxxxxxxxx</span></p>
                            <p className="text-muted-foreground mt-3"># Or add to ~/.tiltedrc</p>
                            <p><span className="text-emerald-400">tilted</span> auth login</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <p className="text-xs text-amber-200/80">
                            <strong className="text-amber-300">Security:</strong> Never commit API keys to version control.
                            Use environment variables or the CLI&apos;s built-in credential store.
                        </p>
                    </div>
                </div>
            </section>

            {/* Step 3: First MCP Server */}
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        3
                    </span>
                    <h2 className="text-2xl font-bold">Scaffold Your First MCP Server</h2>
                </div>
                <div className="ml-11 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Use the CLI scaffolder to create a new MCP server from a template. Choose from Supabase connector,
                        REST API wrapper, or a blank server.
                    </p>
                    <div className="rounded-2xl overflow-hidden border border-border">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/40 border-b border-border">
                            <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs font-mono text-muted-foreground">Terminal</span>
                        </div>
                        <div className="p-4 bg-background/50 font-mono text-sm space-y-2">
                            <p className="text-muted-foreground"># Create a new MCP server</p>
                            <p><span className="text-emerald-400">npx</span> create-tilted-mcp my-first-server</p>
                            <p className="text-muted-foreground mt-3"># Choose a template:</p>
                            <p className="text-violet-300">  ❯ Supabase Connector</p>
                            <p className="text-muted-foreground">    REST API Wrapper</p>
                            <p className="text-muted-foreground">    Custom (blank)</p>
                            <p className="text-muted-foreground mt-3"># Start the dev server</p>
                            <p><span className="text-emerald-400">cd</span> my-first-server</p>
                            <p><span className="text-emerald-400">tilted</span> dev</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        The scaffolder generates a complete TypeScript project with tools, resources, and prompts
                        stubs — following the official MCP SDK patterns.
                    </p>
                </div>
            </section>

            {/* Step 4: Test Locally */}
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        4
                    </span>
                    <h2 className="text-2xl font-bold">Connect to Your AI Client</h2>
                </div>
                <div className="ml-11 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        While running <code className="font-mono bg-white/[0.05] px-1.5 py-0.5 rounded text-xs">tilted dev</code>,
                        connect your AI coding client to the local server for testing.
                    </p>
                    <div className="rounded-2xl overflow-hidden border border-border">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/40 border-b border-border">
                            <span className="text-xs font-mono text-muted-foreground">claude_desktop_config.json</span>
                        </div>
                        <div className="p-4 bg-background/50 font-mono text-xs leading-relaxed">
                            <p>{"{"}</p>
                            <p className="ml-4"><span className="text-blue-300">&quot;mcpServers&quot;</span>: {"{"}</p>
                            <p className="ml-8"><span className="text-blue-300">&quot;my-first-server&quot;</span>: {"{"}</p>
                            <p className="ml-12"><span className="text-blue-300">&quot;url&quot;</span>: <span className="text-amber-300">&quot;http://localhost:8787/mcp&quot;</span></p>
                            <p className="ml-8">{"}"}</p>
                            <p className="ml-4">{"}"}</p>
                            <p>{"}"}</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        For Cursor and Claude Code, use the Streamable HTTP transport URL. For Claude Desktop,
                        add the server config to your <code className="font-mono bg-white/[0.05] px-1.5 py-0.5 rounded text-xs">claude_desktop_config.json</code>.
                    </p>
                </div>
            </section>

            {/* Step 5: Deploy */}
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        5
                    </span>
                    <h2 className="text-2xl font-bold">Deploy to Production</h2>
                </div>
                <div className="ml-11 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        One command deploys your server to Cloudflare Workers edge with auto-injected OAuth 2.1,
                        rate limiting, and monitoring.
                    </p>
                    <div className="rounded-2xl overflow-hidden border border-border">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/40 border-b border-border">
                            <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs font-mono text-muted-foreground">Terminal</span>
                        </div>
                        <div className="p-4 bg-background/50 font-mono text-sm space-y-2">
                            <p><span className="text-emerald-400">tilted</span> deploy</p>
                            <p className="text-muted-foreground mt-2">  ✓ Bundling server code...</p>
                            <p className="text-muted-foreground">  ✓ Deploying to Cloudflare Workers...</p>
                            <p className="text-muted-foreground">  ✓ OAuth 2.1 configured (Auth0)...</p>
                            <p className="text-muted-foreground">  ✓ Monitoring enabled...</p>
                            <p className="text-emerald-400 mt-2">  ✨ Live at: my-first-server.mcp.tiltedprompts.com</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Your server is now globally distributed with zero cold starts. Update your client config
                        to point to the production URL and you&apos;re live.
                    </p>
                </div>
            </section>

            {/* What's Next */}
            <section>
                <h2 className="text-2xl font-bold mb-6">What&apos;s Next?</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <Link
                        href="/docs/tilted-mcp"
                        className="group p-5 rounded-2xl bg-secondary/20 border border-border hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <Server className="w-5 h-5 text-indigo-400 mb-3" />
                        <h3 className="font-bold text-sm mb-1">Explore MCP Servers</h3>
                        <p className="text-xs text-muted-foreground">Pre-built servers for Supabase, GitHub, Notion, and more.</p>
                        <span className="text-xs text-primary mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Learn more <ArrowRight className="w-3 h-3" />
                        </span>
                    </Link>
                    <Link
                        href="/docs/tilted-voice"
                        className="group p-5 rounded-2xl bg-secondary/20 border border-border hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <Mic2 className="w-5 h-5 text-emerald-400 mb-3" />
                        <h3 className="font-bold text-sm mb-1">Set Up Voice AI</h3>
                        <p className="text-xs text-muted-foreground">On-device Whisper or cloud-based Indian language transcription.</p>
                        <span className="text-xs text-primary mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Learn more <ArrowRight className="w-3 h-3" />
                        </span>
                    </Link>
                    <Link
                        href="/docs/tilted-code"
                        className="group p-5 rounded-2xl bg-secondary/20 border border-border hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <Code2 className="w-5 h-5 text-blue-400 mb-3" />
                        <h3 className="font-bold text-sm mb-1">Use Code Templates</h3>
                        <p className="text-xs text-muted-foreground">Agent-optimized Next.js starters with MCP pre-wired.</p>
                        <span className="text-xs text-primary mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Learn more <ArrowRight className="w-3 h-3" />
                        </span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
