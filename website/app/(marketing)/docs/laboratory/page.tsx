import Link from "next/link";
import { FlaskConical, ArrowRight, Workflow, MessageSquare, CreditCard, BarChart3, Users, Instagram, ShoppingCart, Smartphone, IndianRupee } from "lucide-react";

export const metadata = {
    title: "The Laboratory Documentation — TiltedPrompts",
    description: "Pre-built n8n workflows and WhatsApp automation for Indian MSMEs. Business automation in a box.",
};

const workflows = [
    {
        name: "Instagram → WhatsApp Lead Funnel",
        icon: Instagram,
        description: "Automatically capture Instagram DM leads and push them into a WhatsApp Business conversation. Qualify leads with automated questions, then route hot leads to sales.",
        steps: ["Instagram DM trigger", "Lead qualification bot", "WhatsApp welcome message", "CRM entry creation", "Sales team notification"],
        category: "Lead Generation",
    },
    {
        name: "WhatsApp Order Management",
        icon: ShoppingCart,
        description: "End-to-end order management via WhatsApp. Customers browse catalog, place orders, and get tracking updates — all within WhatsApp Business.",
        steps: ["Product catalog display", "Cart management", "UPI payment link generation", "Order confirmation", "Shipping status updates"],
        category: "E-Commerce",
    },
    {
        name: "Razorpay Payment Collection",
        icon: IndianRupee,
        description: "Automated payment reminders and collection via WhatsApp. Generate Razorpay payment links, send reminders, and reconcile payments automatically.",
        steps: ["Invoice creation", "WhatsApp payment link", "Reminder schedule", "Payment confirmation", "Receipt generation"],
        category: "Payments",
    },
    {
        name: "Customer Support Pipeline",
        icon: MessageSquare,
        description: "AI-powered first response on WhatsApp with human handoff. Handle FAQs automatically, escalate complex issues, and track resolution metrics.",
        steps: ["WhatsApp message trigger", "AI intent detection", "FAQ auto-response", "Human handoff routing", "Resolution tracking"],
        category: "Support",
    },
    {
        name: "CRM Automation Pipeline",
        icon: Users,
        description: "Keep your CRM in sync across WhatsApp, Instagram, and website leads. Auto-create contacts, update deal stages, and trigger follow-ups.",
        steps: ["Multi-source lead capture", "Contact deduplication", "Deal stage management", "Follow-up scheduling", "Pipeline analytics"],
        category: "CRM",
    },
    {
        name: "Review & Feedback Collection",
        icon: BarChart3,
        description: "Post-purchase review collection via WhatsApp. Automated follow-up, star rating collection, and Google/social media review requests.",
        steps: ["Post-purchase trigger", "Review request message", "Rating collection", "Google review redirect", "Feedback analytics"],
        category: "Reviews",
    },
];

export default function LaboratoryDocsPage() {
    return (
        <div>
            {/* Header */}
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-medium mb-4">
                    <FlaskConical className="w-3 h-3" /> Automation Engine
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
                    The <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">Laboratory</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                    Pre-built n8n workflows and WhatsApp automation for Indian MSMEs.
                    Business automation in a box — no code required, just import and configure.
                </p>
            </div>

            {/* Why This Exists */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Built for Indian Businesses</h2>
                <div className="p-6 rounded-2xl bg-secondary/20 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>
                        India has 63 million MSMEs, and WhatsApp is their primary business communication tool. But most
                        automation platforms are built for Western markets — Slack integrations, email workflows, CRM systems
                        that don&apos;t understand UPI or WhatsApp Business.
                    </p>
                    <p>
                        The Laboratory fills this gap. Every workflow is designed for the Indian market — UPI payments via
                        Razorpay, WhatsApp Business API via Gupshup, Instagram DM automation, and CRM pipelines that work
                        the way Indian businesses actually operate.
                    </p>
                </div>
            </section>

            {/* What's Included */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">What&apos;s Included</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { icon: Workflow, title: "n8n Workflow Files", desc: "Importable JSON workflow files. Open n8n, import, configure credentials, and you're live." },
                        { icon: Smartphone, title: "WhatsApp Business Setup", desc: "Step-by-step guides for WhatsApp Business API setup via Gupshup BSP. From Meta verification to first message." },
                        { icon: CreditCard, title: "Payment Integrations", desc: "Razorpay + UPI payment links, auto-reconciliation, receipt generation, and payment reminder automation." },
                        { icon: BarChart3, title: "Analytics Dashboards", desc: "Pre-built dashboards for conversation metrics, conversion rates, and revenue attribution across channels." },
                    ].map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.title} className="p-5 rounded-2xl bg-secondary/20 border border-border">
                                <Icon className="w-5 h-5 text-orange-400 mb-3" />
                                <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Workflows */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Pre-Built Workflows</h2>
                <div className="space-y-4">
                    {workflows.map((workflow) => {
                        const Icon = workflow.icon;
                        return (
                            <div key={workflow.name} className="p-6 rounded-2xl bg-secondary/20 border border-border">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-sm">{workflow.name}</h3>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400">
                                                {workflow.category}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{workflow.description}</p>
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {workflow.steps.map((step, i) => (
                                                <span key={step} className="flex items-center gap-1">
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-muted-foreground">
                                                        {step}
                                                    </span>
                                                    {i < workflow.steps.length - 1 && (
                                                        <span className="text-muted-foreground/30 text-[10px]">→</span>
                                                    )}
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

            {/* How to Use */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">How to Use</h2>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 text-sm font-bold shrink-0">
                            1
                        </span>
                        <div>
                            <h3 className="font-bold text-sm mb-1">Set Up n8n</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Install n8n locally or use n8n Cloud. Self-hosted is free and gives you full control.
                                We recommend Docker deployment for production use.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 text-sm font-bold shrink-0">
                            2
                        </span>
                        <div>
                            <h3 className="font-bold text-sm mb-1">Import Workflow</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Download the workflow JSON from the members area or n8n community marketplace.
                                Import it into your n8n instance via Settings → Import.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 text-sm font-bold shrink-0">
                            3
                        </span>
                        <div>
                            <h3 className="font-bold text-sm mb-1">Configure Credentials</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Add your API keys — Gupshup for WhatsApp, Razorpay for payments, and your CRM webhook.
                                Each workflow has clear credential labels telling you exactly what&apos;s needed.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 text-sm font-bold shrink-0">
                            4
                        </span>
                        <div>
                            <h3 className="font-bold text-sm mb-1">Activate & Monitor</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Toggle the workflow active and test with a real message. Monitor execution logs
                                in n8n and analytics in the provided dashboard template.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Distribution */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Distribution</h2>
                <div className="p-5 rounded-2xl bg-secondary/20 border border-border">
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <Users className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-foreground">Members Area</p>
                                <p className="text-xs text-muted-foreground">Full workflow library with setup guides and video walkthroughs.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Workflow className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-foreground">n8n Community Marketplace</p>
                                <p className="text-xs text-muted-foreground">Free core workflows published on the official n8n community templates.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CreditCard className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-foreground">Individual Bundles</p>
                                <p className="text-xs text-muted-foreground">Buy specific workflow bundles on Gumroad or Lemon Squeezy. One-time purchase.</p>
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
                            { label: "Automation", value: "n8n (self-hosted or cloud)" },
                            { label: "WhatsApp", value: "Gupshup BSP (Meta Partner)" },
                            { label: "Payments", value: "Razorpay + UPI" },
                            { label: "CRM", value: "Webhook-based (any CRM)" },
                            { label: "Analytics", value: "n8n execution logs + custom" },
                            { label: "Hosting", value: "Docker / n8n Cloud" },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-xs text-muted-foreground/60 uppercase tracking-wider">{item.label}</p>
                                <p className="text-foreground font-medium text-sm">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Back to overview */}
            <div className="flex items-center justify-between p-5 rounded-2xl bg-secondary/20 border border-border">
                <div>
                    <p className="text-sm font-bold">Back to Overview</p>
                    <p className="text-xs text-muted-foreground">See how all products fit together</p>
                </div>
                <Link href="/docs" className="flex items-center gap-1 text-sm text-primary hover:underline">
                    Overview <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
