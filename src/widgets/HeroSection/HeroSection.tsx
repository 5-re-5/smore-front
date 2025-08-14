const HeroSection = () => {
  return (
    <section className="relative w-[1440px] h-[800px] mx-auto overflow-hidden">
      {/* 배경 동영상 */}
      <video
        className="absolute w-full h-full object-cover"
        src="/video/HeroSectionVideo.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* 반투명 오버레이 */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 콘텐츠 */}
      <div className="absolute inset-0 flex flex-col justify-center items-center z-10 text-center px-4">
        <h1 className="text-[8rem] font-black-han-sans text-royalblue leading-none mb-8">
          S’m<span className="text-orangered">o</span>re
        </h1>
        <p className="font-manrope text-white text-2xl mb-12 opacity-90 whitespace-nowrap">
          AI 집중도 분석과 타이머 기능으로 효율적인 온라인 학습 환경을
          제공합니다
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <span className="px-8 py-2 rounded-full border border-white font-roboto text-white text-lg bg-white/10 backdrop-blur-md">
            #모각공
          </span>
          <span className="px-8 py-2 rounded-full border border-white font-roboto text-white text-lg bg-white/10 backdrop-blur-md">
            #MZ공부트렌드
          </span>
          <span className="px-8 py-2 rounded-full border border-white font-roboto text-white text-lg bg-white/10 backdrop-blur-md">
            #공스타그램
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
