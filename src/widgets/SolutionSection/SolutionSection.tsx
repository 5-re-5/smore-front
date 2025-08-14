const SolutionSection = () => {
  return (
    <section className="relative w-full max-w-[1440px] h-auto lg:h-[678px] mx-auto bg-white overflow-hidden font-noto-sans px-4 lg:px-0 py-12 lg:py-0">
      {/* PNG 이미지들 절대 위치로 배치, 원하는 크기와 위치로 조절 */}
      <img
        src="/images/whitebox.png"
        alt="Whitebox"
        className="absolute top-[5px] left-[900px] w-[250px] h-auto"
      />
      <img
        src="/images/whitebox.png"
        alt="Whitebox"
        className="absolute top-[235px] left-[580px] w-[250px] h-auto"
      />
      <img
        src="/images/whitebox.png"
        alt="Whitebox"
        className="absolute top-[360px] left-[150px] w-[250px] h-auto"
      />

      <img
        src="/images/barchart.png"
        alt="Bar Chart"
        className="absolute bottom-[120px] left-[950px] w-[90px] h-auto"
      />
      <img
        src="/images/icon1_oreo.png"
        alt="Icon Oreo"
        className="absolute top-[515px] left-[260px] w-[50px] h-auto"
      />
      <img
        src="/images/icon2_clock.png"
        alt="Icon Clock"
        className="absolute top-[385px] left-[685px] w-[50px] h-auto"
      />
      <img
        src="/images/icon3_marshmallow.png"
        alt="Icon Marshmallow"
        className="absolute top-[160px] left-[1005px] w-[60px] h-auto"
      />
      <img
        src="/images/line_vector.png"
        alt="Line Vector"
        className="absolute top-[180px] left-[100px] w-[1000px] h-auto"
      />
      <img
        src="/images/marshmallow.png"
        alt="Marshmallow"
        className="absolute top-[220px] right-[65px] w-[120px] h-auto"
      />
      <img
        src="/images/number1.png"
        alt="Number 1"
        className="absolute bottom-[30px] left-[390px] w-[75px] h-auto"
      />
      <img
        src="/images/number2.png"
        alt="Number 2"
        className="absolute bottom-[190px] left-[880px] w-[80px] h-auto"
      />
      <img
        src="/images/number3.png"
        alt="Number 3"
        className="absolute top-[150px] right-[160px] w-[80px] h-auto"
      />
      <img
        src="/images/oreo.png"
        alt="Oreo"
        className="absolute top-[570px] left-[470px] w-[100px] h-auto"
      />

      {/* 기존 섹션 타이틀 및 설명 영역 */}
      <div className="mb-8 lg:absolute lg:top-[-5px] lg:left-20">
        <h2 className="text-[2rem] lg:text-[3rem] font-sans font-black text-dimgray leading-tight w-full lg:w-[482px]">
          <p className="m-0">
            <span className="text-dimgray">S’m</span>
            <span className="text-cornflowerblue">o</span>
            <span>re’가</span>
            <br />
            <span className="whitespace-nowrap">제공하는 최적의 솔루션</span>
          </p>
        </h2>
      </div>

      {/* 설명 영역 */}
      <div className="mt-8 lg:absolute lg:top-[190px] lg:left-[80px] w-full lg:w-[1207px] text-[1rem] font-manrope space-y-12 lg:space-y-0">
        {/* 공통 설명 */}
        <div className="text-[1.125rem] lg:text-[1.375rem] leading-[1.8rem] text-slategray font-noto-sans-kr lg:w-[507px] tracking-[-0.02em] mb-8">
          <p className="m-0">
            <b>오레오 등급 쌓기, 공부 시간 통계 제공, 마시멜로 굽기</b>
            <span className="font-medium"> 등</span>
          </p>
          <p className="m-0 font-medium">
            스모어를 이용하고 매일 공부하는 재미를 느껴보세요!
          </p>
        </div>

        {/* 세부항목 - 반응형에서는 세로, 데스크톱에서는 절대좌표 */}
        <div className="space-y-8 lg:space-y-0">
          {/* 마시멜로 */}
          <div className="lg:absolute lg:top-0 lg:left-[927px] w-full lg:w-[279.5px]">
            <div className="font-extrabold text-[1.1rem] lg:text-[1.25rem] leading-[1.8rem] mb-2">
              매일 마시멜로 굽기
            </div>
            <div className="font-medium text-slategray leading-[1.7rem] tracking-[-0.02em]">
              <p className="m-0">공부 시간이 늘어날수록</p>
              <p className="m-0">노릇노릇 맛있는 마시멜로를 구울 수 있어요!</p>
            </div>
          </div>

          {/* 그래프 */}
          <div className="lg:absolute lg:top-[240px] lg:left-[592px] w-full lg:w-[288px]">
            <div className="font-extrabold text-[1.1rem] lg:text-[1.25rem] leading-[1.8rem] mb-2">
              다양한 공부 그래프 제공
            </div>
            <div className="font-medium text-slategray leading-[1.7rem] tracking-[-0.02em]">
              <p className="m-0">일주일, 주별 평균, 월별 통계 그래프를</p>
              <p className="m-0">
                통해 공부 시간의 추이를 한눈에 볼 수 있어요!
              </p>
            </div>
          </div>

          {/* 오레오 등급 */}
          <div className="lg:absolute lg:top-[368px] lg:left-[125px] w-full lg:w-[303px]">
            <div className="font-extrabold text-[1.1rem] lg:text-[1.25rem] leading-[1.8rem] mb-2">
              오레오 등급 쌓기
            </div>
            <div className="font-medium text-slategray leading-[1.7rem] tracking-[-0.02em]">
              <p className="m-0">공부 시간을 쌓아서 오레오를</p>
              <p className="m-0">
                뽑을 수 있어요. 나만의 오레오를 만들어 보세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
