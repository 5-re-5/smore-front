import HeroSection from '@/widgets/HeroSection/HeroSection';
import AnalysisSection from '@/widgets/AnalysisSection/AnalysisSection';
import SolutionSection from '@/widgets/SolutionSection/SolutionSection';
import FeaturesSection from '@/widgets/FeaturesSection/FeaturesSection';
import ReviewsSection from '@/widgets/ReviewsSection/ReviewsSection';
import ExtraFeaturesSection from '@/widgets/ExtraFeaturesSection/ExtraFeaturesSection';

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <main className="relative flex flex-col w-full z-10">
        {/* 각종 배경/장식 이미지 */}
        <img
          src="/images/circle2.webp"
          alt="Circle2"
          className="
            absolute top-[2200px] left-[1180px] w-[250px] h-[480px] z-20
            pointer-events-none
          "
        />
        <img
          src="/images/pencil_icon.webp"
          alt="Pencil Icon"
          className="
            absolute top-[2370px] left-[1110px] w-[270px] h-[270px] z-30
            cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 animate-cardfloat
          "
          style={{ pointerEvents: 'auto' }}
        />
        {/* 섹션들 */}
        <HeroSection />
        <AnalysisSection />
        <SolutionSection />
        <FeaturesSection />
        <ReviewsSection />
        <ExtraFeaturesSection />
      </main>
    </div>
  );
}
