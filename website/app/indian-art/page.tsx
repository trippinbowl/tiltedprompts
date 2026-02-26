import Hero from "@/components/indian-art/hero";
import { StatsSection } from "@/components/indian-art/stats-section";
import { ProductsSection } from "@/components/indian-art/products-section";
import Features from "@/components/indian-art/features";
import { CTASection } from "@/components/indian-art/cta-section";

export default function IndianArtPage() {
    return (
        <>
            <Hero />
            <StatsSection />
            <ProductsSection />
            <Features />
            <CTASection />
        </>
    );
}
