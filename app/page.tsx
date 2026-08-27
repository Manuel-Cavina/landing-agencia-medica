import { Hero } from "@/components/sections/hero";
import { StatsStrip } from "@/components/sections/stats-strip";
import { ResultsSection } from "@/components/sections/results-section";
import { RoadmapSection } from "@/components/sections/roadmap-section";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <ResultsSection />
      <RoadmapSection />
    </>
  );
}
