import HeroSection from '@/widgets/HeroSection/HeroSection';
import AnalysisSection from '@/widgets/AnalysisSection/AnalysisSection';
import SolutionSection from '@/widgets/SolutionSection/SolutionSection';
import FeaturesSection from '@/widgets/FeaturesSection/FeaturesSection';
import ReviewsSection from '@/widgets/ReviewsSection/ReviewsSection';
import ExtraFeaturesSection from '@/widgets/ExtraFeaturesSection/ExtraFeaturesSection';

export default function HomePage() {
  return (
    <main className="flex flex-col w-full">
      <HeroSection />
      <AnalysisSection />
      <SolutionSection />
      <FeaturesSection />
      <ReviewsSection />
      <ExtraFeaturesSection />
    </main>
  );
}
