import { Hero } from "@/components/sections/hero";
import { StatsStrip } from "@/components/sections/stats-strip";
import { ResultsSection } from "@/components/sections/results-section";
import { RoadmapSection } from "@/components/sections/roadmap-section";
import { CalculatorSection } from "@/components/sections/calculator-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <ResultsSection />
      <RoadmapSection />
      <CalculatorSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
