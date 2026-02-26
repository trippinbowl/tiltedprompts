import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/effects/ScrollProgress";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="pt-[72px]">{children}</main>
      <Footer />
    </>
  );
}
