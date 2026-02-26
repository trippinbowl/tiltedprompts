import ProductHero from "@/components/products/ProductHero";
import FeatureGrid from "@/components/products/FeatureGrid";
import PricingTable from "@/components/products/PricingTable";
import CtaBanner from "@/components/home/CtaBanner";
import { PRICING } from "@/lib/constants";

export const metadata = {
  title: "The Laboratory — Workflows & Marketing Prompts | TiltedPrompts",
  description: "Curated n8n automation workflows and high-conversion marketing prompts. WhatsApp, Instagram, email, SEO — in English and Hindi.",
};

const features = [
  { title: "Copy-Paste Prompts", description: "Battle-tested prompts with fill-in-the-blank placeholders. Works with ChatGPT, Claude, Gemini, and DeepSeek." },
  { title: "n8n Workflow Templates", description: "Pre-built automation workflows for lead capture, social posting, email sequences, and ticket routing." },
  { title: "Multi-Language Packs", description: "Prompts in English, Hindi, Tamil, Telugu, Bengali, and more. Reach every customer in their language." },
  { title: "Custom GPT Configs", description: "Pre-configured GPT instructions for SEO, social media, email, and analytics. Deploy specialized AI assistants." },
  { title: "Chrome Extension", description: "Inject prompts directly into ChatGPT, Claude, and Gemini. One click, no copy-pasting." },
  { title: "Weekly Updates", description: "New bundles added every week covering trending niches, new AI models, and market opportunities." },
];

const bundles = [
  { name: "WhatsApp Marketing Pack", count: 15, tag: "BESTSELLER" },
  { name: "Instagram & Reels Scripts", count: 15, tag: "TRENDING" },
  { name: "Sales Email & Outreach", count: 15, tag: "NEW" },
  { name: "Semantic SEO Toolkit", count: 20, tag: "PRO" },
  { name: "D2C Brand Launch Kit", count: 25, tag: "PREMIUM" },
  { name: "Hindi Marketing Prompts", count: 15, tag: "REGIONAL" },
];

export default function LaboratoryPage() {
  return (
    <>
      <ProductHero
        badge="THE LABORATORY"
        title="Workflows & Prompts"
        highlight="That Ship."
        description="Curated n8n automations and high-conversion marketing prompts for builders who move fast. WhatsApp, Instagram, email, SEO — in English and Hindi."
        color="#ec4899"
        ctaText="Get All Access — $29"
        ctaHref="/contact"
      >
        {/* Bundle Preview Grid */}
        <div className="grid grid-cols-2 gap-3">
          {bundles.map((b) => (
            <div
              key={b.name}
              className="glass-card rounded-[var(--radius-md)] p-4 group"
            >
              <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--accent-pink)] mb-2">
                {b.tag}
              </div>
              <div className="text-sm font-semibold text-[var(--text-0)] leading-tight group-hover:text-white transition-colors">
                {b.name}
              </div>
              <div className="text-xs text-[var(--text-3)] mt-1.5">{b.count} assets</div>
            </div>
          ))}
        </div>
      </ProductHero>

      <FeatureGrid
        label="WHAT'S INSIDE"
        heading={<>Not Just Prompts.<br /><span className="gradient-text">Complete Systems.</span></>}
        description="Every bundle includes prompts, GPT instructions, and workflow templates that work together as a system."
        features={features}
        color="#ec4899"
      />

      <PricingTable tiers={PRICING.laboratory.tiers} />
      <CtaBanner />
    </>
  );
}
