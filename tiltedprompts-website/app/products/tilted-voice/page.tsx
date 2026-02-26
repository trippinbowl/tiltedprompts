import ProductHero from "@/components/products/ProductHero";
import FeatureGrid from "@/components/products/FeatureGrid";
import PricingTable from "@/components/products/PricingTable";
import CtaBanner from "@/components/home/CtaBanner";
import { PRICING } from "@/lib/constants";

export const metadata = {
  title: "TiltedVoice — Low-Latency Voice AI Agents | TiltedPrompts",
  description: "Deploy conversational voice agents that sound human and respond in under 500ms. Multi-language support including Hindi, Tamil, Telugu.",
};

const features = [
  { title: "Sub-500ms Latency", description: "Optimized STT-LLM-TTS pipeline with voice activity detection. Conversations feel natural." },
  { title: "12+ Languages", description: "English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada and more. Reach every customer." },
  { title: "CRM Integration", description: "Native connectors for HubSpot, Salesforce, and custom webhooks. Every call updates your pipeline." },
  { title: "Interruption Handling", description: "Real-time voice activity detection with graceful interruption handling. No awkward pauses." },
  { title: "Call Recording & Transcription", description: "Full recording with real-time transcription. Search and analyze every conversation." },
  { title: "Sentiment Analysis", description: "Per-utterance sentiment scoring. Route escalations before customers get frustrated." },
];

export default function TiltedVoicePage() {
  return (
    <>
      <ProductHero
        badge="VOICE AI AGENTS"
        title="Conversations That"
        highlight="Convert."
        description="Deploy voice AI agents that sound human, respond in under 500ms, and speak 12+ languages including Hindi and Tamil. For support, sales, and appointments."
        color="#22d3ee"
        ctaText="Start Building"
        ctaHref="/contact"
      >
        {/* Waveform Visual */}
        <div className="glass-card-solid rounded-[var(--radius-xl)] p-8 border border-white/[0.06]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[rgba(34,211,238,0.12)] flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#22d3ee] animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text-0)]">TiltedVoice Agent</div>
              <div className="text-xs text-[var(--accent-cyan)]">Active &middot; English + Hindi</div>
            </div>
          </div>
          {/* Waveform bars */}
          <div className="flex items-end gap-1 h-16 mb-6">
            {[40, 65, 30, 80, 55, 70, 25, 90, 45, 60, 35, 75, 50, 85, 40, 70, 55, 65, 30, 80].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-full bg-[var(--accent-cyan)]"
                style={{ height: `${h}%`, opacity: 0.4 + (h / 200), animation: `pulse-ring ${1 + (i % 3) * 0.3}s ease-in-out infinite` }}
              />
            ))}
          </div>
          <div className="space-y-2 text-sm font-[var(--font-mono)]">
            <div className="text-[var(--text-3)]">Latency: <span className="text-[var(--accent-cyan)]">320ms</span></div>
            <div className="text-[var(--text-3)]">Duration: <span className="text-[var(--text-1)]">2:34</span></div>
            <div className="text-[var(--text-3)]">Sentiment: <span className="text-[var(--accent)]">Positive</span></div>
          </div>
        </div>
      </ProductHero>

      <FeatureGrid
        label="CAPABILITIES"
        heading={<>Human-Grade Voice.<br /><span className="gradient-text">Machine-Grade Speed.</span></>}
        description="Every TiltedVoice agent is optimized for real-time conversation with zero awkward silences."
        features={features}
        color="#22d3ee"
      />

      <PricingTable tiers={PRICING.voice.tiers} />
      <CtaBanner />
    </>
  );
}
