import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import PainSection from '../components/landing/PainSection';
import PopularCities from '../components/landing/PopularCities';
import WhyHostelMate from '../components/landing/WhyHostelMate';
import { ComparisonTeaser, SafetySection, Testimonials, ForOwners, FinalCTA } from '../components/landing/MoreSections';
import InsightsTeaser from '../components/landing/InsightsTeaser';

export default function Landing() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <PainSection />
      <PopularCities />
      <WhyHostelMate />
      <ComparisonTeaser />
      <InsightsTeaser />
      <SafetySection />
      <Testimonials />
      <ForOwners />
      <FinalCTA />
    </div>
  );
}
