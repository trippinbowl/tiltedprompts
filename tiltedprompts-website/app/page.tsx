import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/effects/ScrollProgress";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import ProductSuite from "@/components/home/ProductSuite";
import Organization from "@/components/home/Organization";
import Stats from "@/components/home/Stats";
import SocialProof from "@/components/home/SocialProof";
import CtaBanner from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <main>
        <ScrollProgress />
        <Navbar />
        <Hero />
        <Marquee />
        <ProductSuite />
        <Organization />
        <Stats />
        <SocialProof />
        <CtaBanner />
        <Footer />
      </main>
    </>
  );
}
