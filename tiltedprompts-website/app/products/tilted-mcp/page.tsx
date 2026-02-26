import ProductHero from "@/components/products/ProductHero";
import FeatureGrid from "@/components/products/FeatureGrid";
import PricingTable from "@/components/products/PricingTable";
import CtaBanner from "@/components/home/CtaBanner";
import { PRICING } from "@/lib/constants";

export const metadata = {
  title: "TiltedMCP — High-Performance MCP Servers | TiltedPrompts",
  description: "Production-ready Model Context Protocol servers connecting AI agents to any data source in under 10ms. SQLite, Slack, Search, PostgreSQL, GitHub.",
};

const features = [
  { title: "Sub-10ms Response", description: "Optimized connection pooling and query execution for real-time AI agent interactions." },
  { title: "Multi-Database Support", description: "SQLite, PostgreSQL, MySQL — connect any database through a unified MCP interface." },
  { title: "Docker-Ready Deployment", description: "Pre-built Docker images for every server variant. One command to production." },
  { title: "Auto-Reconnection", description: "Exponential backoff with circuit-breaker patterns. Your agents stay connected." },
  { title: "Structured Logging", description: "JSON-formatted logs with correlation IDs. Debug any request across the stack." },
  { title: "OpenTelemetry Tracing", description: "Full distributed tracing built in. See exactly where time is spent." },
];

export default function TiltedMCPPage() {
  return (
    <>
      <ProductHero
        badge="MODEL CONTEXT PROTOCOL"
        title="Connect AI to"
        highlight="Everything."
        description="Production-ready MCP servers that let any AI agent — Cursor, Claude Desktop, or your custom build — access databases, APIs, and services in under 10ms."
        color="#06d6a0"
        ctaText="Start Free"
        ctaHref="/contact"
      >
        {/* Terminal Visual */}
        <div className="glass-card-solid rounded-[var(--radius-xl)] overflow-hidden border border-white/[0.06]">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]/80" />
              <span className="w-3 h-3 rounded-full bg-[#f59e0b]/80" />
              <span className="w-3 h-3 rounded-full bg-[#22c55e]/80" />
            </div>
            <span className="ml-3 text-[12px] font-[var(--font-mono)] text-[var(--text-3)]">mcp_server.config</span>
          </div>
          <div className="px-5 py-5 text-[13px] font-[var(--font-mono)] leading-[1.85] text-[var(--text-2)] space-y-0.5">
            <div><span className="text-[var(--primary-light)]">server</span><span className="text-[var(--text-3)]">:</span> tilted-mcp-sqlite</div>
            <div><span className="text-[var(--primary-light)]">port</span><span className="text-[var(--text-3)]">:</span> <span className="text-[var(--accent)]">3100</span></div>
            <div><span className="text-[var(--primary-light)]">database</span><span className="text-[var(--text-3)]">:</span> ./data/analytics.db</div>
            <div><span className="text-[var(--primary-light)]">pool_size</span><span className="text-[var(--text-3)]">:</span> <span className="text-[var(--accent)]">10</span></div>
            <div><span className="text-[var(--primary-light)]">tracing</span><span className="text-[var(--text-3)]">:</span> <span className="text-[var(--accent)]">true</span></div>
            <div className="pt-3 text-[var(--accent)]">&#10003; Server ready in 47ms</div>
            <div className="text-[var(--accent)]">&#10003; Accepting MCP connections</div>
          </div>
        </div>
      </ProductHero>

      <FeatureGrid
        label="CAPABILITIES"
        heading={<>Built for Production.<br /><span className="gradient-text">Not Prototypes.</span></>}
        description="Every TiltedMCP server is hardened for real-world deployment with enterprise-grade reliability."
        features={features}
        color="#06d6a0"
      />

      <PricingTable tiers={PRICING.mcp.tiers} />
      <CtaBanner />
    </>
  );
}
