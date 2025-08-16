const AnalysisSection = () => {
  return (
    <section className="relative w-full max-w-[1440px] h-[900px] mx-auto bg-white overflow-hidden px-10 pt-24 font-sans">
      {/* 상단 타이틀 및 설명 */}
      <div className="absolute left-10 top-16 pl-8">
        <b className="block text-[1.2rem] text-[#5D5FEF] mb-2 font-bold">
          최신형 AI 모델을 활용한 집중도 분석
        </b>
        {/* 자간(tracking), 행간(leading) */}
        <div className="text-[3rem] tracking-[-0.03em] leading-[4rem] font-extrabold text-black mb-6">
          <p className="m-0">AI 집중도 분석 기능으로</p>
          <p className="m-0">효율적인 공부를</p>
          <p className="m-0">해보세요</p>
        </div>
        {/* mt 로 수직 위치 조절 */}
        <div className="mt-15 text-[1.125rem] leading-8 tracking-[-0.02em] text-slategray max-w-[600px] mb-4">
          <span className="font-semibold">AI 피드백</span>과{' '}
          <span className="font-semibold">최고·최저 집중 시간</span>,{' '}
          <span className="font-semibold">평균 집중 유지 시간을</span>
          <br />
          통해 나에게 알맞은 공부 패턴을 파악해 보세요!
        </div>
      </div>

      {/* 오른쪽 그래프 이미지 */}
      <img
        src="/images/graphs.png"
        alt="AI 집중도 분석 그래프"
        className="absolute bottom-45 left-170 w-[880px] h-[780px] object-cover drop-shadow-md select-none pointer-events-none"
        draggable={false}
      />

      {/* 요약 카드 & 분석 버튼 */}
      <div className="absolute left-18 bottom-55 flex items-center space-x-4">
        <div className="relative shadow-[0_4px_15px_#c3c3c3_inset,-6px_-4px_15px_#fff_inset] rounded-[14px] bg-white w-[520px] h-[72px] flex items-center pl-12">
          <span className="font-bold text-dimgray opacity-60">
            오늘은 총 2시간 40분 공부했어요!
          </span>
        </div>
        <button
          className="relative 
             top-[0px]     
             left-[-100px]    
             shadow-[-6px_-4px_15px_#fff,4px_4px_15px_#c3c3c3] 
             rounded-[14px] 
             bg-gradient-to-b from-[#ff7300] to-[#ff8f06] 
             w-[132px] h-[64px] 
             flex items-center justify-center 
             -ml-12 
             hover:brightness-90 
             transition-all"
        >
          <span className="font-semibold text-white text-xl text-center select-none">
            분석하기
          </span>
        </button>
      </div>

      {/* 웨이브 이미지 */}
      <img
        src="/images/wave.webp"
        alt=""
        className="absolute left-[-140px] bottom-[10px] w-[1040px] h-[890px] pointer-events-none select-none opacity-70"
        draggable={false}
      />
    </section>
  );
};

export default AnalysisSection;
