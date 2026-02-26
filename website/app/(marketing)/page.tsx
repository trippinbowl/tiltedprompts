import { HeroSection } from "@/components/ui/hero-section";
import { ProductsSection } from "@/components/ui/products-section";
import { DemoVideoPlaceholder } from "@/components/ui/demo-video-placeholder";
import { FeaturesSection } from "@/components/ui/features-section";
import { StatsSection } from "@/components/ui/stats-section";
import { CTASection } from "@/components/ui/cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProductsSection />
      <DemoVideoPlaceholder />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </>
  );
}
