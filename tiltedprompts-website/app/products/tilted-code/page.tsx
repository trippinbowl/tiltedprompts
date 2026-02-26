import ProductHero from "@/components/products/ProductHero";
import FeatureGrid from "@/components/products/FeatureGrid";
import PricingTable from "@/components/products/PricingTable";
import CtaBanner from "@/components/home/CtaBanner";
import { PRICING } from "@/lib/constants";

export const metadata = {
  title: "TiltedCode — Vibe Coding Templates | TiltedPrompts",
  description: "Start any AI-powered project with production-grade templates pre-wired for vibe coding. Next.js, auth, payments, MCP integration built in.",
};

const features = [
  { title: "Pre-Wired MCP Connections", description: "Every template comes with MCP client integration. Connect to any data source from day one." },
  { title: "Auth + Payments Built In", description: "Clerk or Supabase auth, Stripe or Lemon Squeezy payments. Zero boilerplate configuration." },
  { title: "AI Routing Layer", description: "Multi-provider AI integration (OpenAI, Anthropic, local models) with automatic fallback and load balancing." },
  { title: "Responsive Design System", description: "TailwindCSS v4, Framer Motion, dark/light themes. Every component is accessible and responsive." },
  { title: "Database ORM Setup", description: "Drizzle ORM with PostgreSQL, migrations, type-safe queries. Schema-first database design." },
  { title: "One-Command Deploy", description: "Vercel, Railway, or Docker deployment configs included. Push to deploy in under 60 seconds." },
];

const templates = [
  { name: "Next.js Agentic Starter", desc: "Full-stack template with AI agent routing, MCP client, and design system.", price: "$49" },
  { name: "SaaS Boilerplate", desc: "Multi-tenant SaaS with admin dashboard, usage metering, and email service.", price: "$149" },
  { name: "E-commerce + AI", desc: "Product catalog, cart, checkout, AI search, and dynamic pricing.", price: "$199" },
  { name: "Landing Page Builder", desc: "Marketing pages with A/B testing, analytics, lead capture, and CMS.", price: "$79" },
];

export default function TiltedCodePage() {
  return (
    <>
      <ProductHero
        badge="VIBE CODING TEMPLATES"
        title="From Intent to"
        highlight="Production."
        description="Start any AI-powered project with production-grade Next.js templates. Auth, payments, database, MCP connections, and AI routing — all pre-wired and ready to vibe code."
        color="#818cf8"
        ctaText="Browse Templates"
        ctaHref="/contact"
      >
        {/* Template Cards */}
        <div className="space-y-3">
          {templates.map((t) => (
            <div
              key={t.name}
              className="glass-card rounded-[var(--radius-md)] p-5 flex items-center justify-between gap-4 group"
            >
              <div>
                <div className="text-sm font-bold text-[var(--text-0)] group-hover:text-white transition-colors">{t.name}</div>
                <div className="text-xs text-[var(--text-3)] mt-1">{t.desc}</div>
              </div>
              <span className="text-sm font-bold text-[var(--primary-light)] shrink-0">{t.price}</span>
            </div>
          ))}
        </div>
      </ProductHero>

      <FeatureGrid
        label="WHAT'S INCLUDED"
        heading={<>Everything Pre-Wired.<br /><span className="gradient-text">Nothing Left Out.</span></>}
        description="Every template is a complete, runnable Next.js application with production-grade infrastructure."
        features={features}
        color="#818cf8"
      />

      <PricingTable tiers={PRICING.code.tiers} />
      <CtaBanner />
    </>
  );
}
