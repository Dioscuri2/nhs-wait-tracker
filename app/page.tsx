import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import FeatureCards from "@/components/FeatureCards";
import GpRightsSection from "@/components/GpRightsSection";
import PricingSection from "@/components/PricingSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeatureCards />
      <GpRightsSection />
      <PricingSection />
    </>
  );
}
