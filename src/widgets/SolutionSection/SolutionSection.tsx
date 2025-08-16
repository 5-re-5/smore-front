import { useState, useEffect, useRef } from 'react';

const SolutionSection = () => {
  // 화면에 보이는지 상태 관리
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  useEffect(() => {
    const observer1 = new IntersectionObserver(
      ([entry]) => setVisible1(entry.isIntersecting),
      { threshold: 0.5 },
    );
    const observer2 = new IntersectionObserver(
      ([entry]) => setVisible2(entry.isIntersecting),
      { threshold: 0.5 },
    );
    const observer3 = new IntersectionObserver(
      ([entry]) => setVisible3(entry.isIntersecting),
      { threshold: 0.5 },
    );

    if (ref1.current) observer1.observe(ref1.current);
    if (ref2.current) observer2.observe(ref2.current);
    if (ref3.current) observer3.observe(ref3.current);

    return () => {
      if (ref1.current) observer1.unobserve(ref1.current);
      if (ref2.current) observer2.unobserve(ref2.current);
      if (ref3.current) observer3.unobserve(ref3.current);
    };
  }, []);

  return (
    <section className="relative w-full max-w-[1440px] h-auto lg:h-[678px] mx-auto bg-white overflow-hidden font-noto-sans px-4 lg:px-0 py-12 lg:py-0">
      {/* WEBP 이미지들 절대 위치, 크기 조절 가능 */}
      <img
        src="/images/whitebox.webp"
        alt="Whitebox"
        className="absolute top-[-50px] left-[900px] w-[250px] h-auto z-30"
      />
      <img
        src="/images/whitebox.webp"
        alt="Whitebox"
        className="absolute top-[165px] left-[575px] w-[250px] h-auto z-30"
      />
      <img
        src="/images/whitebox.webp"
        alt="Whitebox"
        className="absolute top-[300px] left-[110px] w-[250px] h-auto z-30"
      />

      {/* circle 이미지도 위치/크기 조절 지원 */}
      <img
        src="/images/circle.webp"
        alt="Circle"
        className="absolute top-[100px] left-[0px] w-[60px] h-[600px] z-40"
      />

      <img
        src="/images/line_vector.webp"
        alt="Line Vector"
        className="absolute top-[90px] left-[100px] w-[1100px] h-auto z-20"
      />

      <img
        ref={ref1}
        src="/images/number1.webp"
        alt="Number 1"
        className={`absolute bottom-[80px] left-[390px] w-[70px] h-auto transition-transform duration-700 ease-out cursor-pointer 
          ${visible1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          hover:scale-110 hover:-translate-y-2 z-40`}
        style={{ transitionProperty: 'opacity, transform' }}
      />
      <img
        ref={ref2}
        src="/images/number2.webp"
        alt="Number 2"
        className={`absolute bottom-[230px] left-[880px] w-[80px] h-auto transition-transform duration-700 ease-out cursor-pointer
          ${visible2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          hover:scale-110 hover:-translate-y-2 z-40`}
        style={{ transitionProperty: 'opacity, transform' }}
      />
      <img
        ref={ref3}
        src="/images/number3.webp"
        alt="Number 3"
        className={`absolute top-[120px] right-[160px] w-[80px] h-auto transition-transform duration-700 ease-out cursor-pointer
          ${visible3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          hover:scale-110 hover:-translate-y-2 z-40`}
        style={{ transitionProperty: 'opacity, transform' }}
      />

      <img
        src="/images/barchart.webp"
        alt="Bar Chart"
        className="absolute bottom-[140px] left-[950px] w-[90px] h-auto"
      />
      <img
        src="/images/icon1_oreo.webp"
        alt="Icon Oreo"
        className="absolute top-[455px] left-[215px] w-[50px] h-auto z-40"
      />
      <img
        src="/images/icon2_clock.webp"
        alt="Icon Clock"
        className="absolute top-[320px] left-[680px] w-[50px] h-auto z-40"
      />
      <img
        src="/images/icon3_marshmallow.webp"
        alt="Icon Marshmallow"
        className="absolute top-[100px] left-[1000px] w-[60px] h-auto z-40"
      />
      <img
        src="/images/marshmallow.webp"
        alt="Marshmallow"
        className="absolute top-[220px] right-[65px] w-[120px] h-auto"
      />
      <img
        src="/images/oreo.webp"
        alt="Oreo"
        className="absolute top-[530px] left-[470px] w-[100px] h-auto"
      />

      {/* 섹션 타이틀 및 설명 영역 */}
      <div className="mb-8 lg:absolute lg:top-[-5px] lg:left-20">
        <h2
          className="text-[2rem] lg:text-[3rem] font-normal leading-tight w-full lg:w-[482px]"
          style={{ fontFamily: '"Black Han Sans", sans-serif' }}
        >
          <span className="text-dimgray">S’m</span>
          <span style={{ color: '#76AAF8' }}>o</span>
          <span className="text-dimgray">re’가</span>
          <br />
          <span className="text-dimgray whitespace-nowrap">
            제공하는 최적의 솔루션
          </span>
        </h2>
      </div>

      {/* 설명 영역 */}
      <div className="mt-8 lg:absolute lg:top-[120px] lg:left-[80px] w-full lg:w-[1207px] text-[1rem] font-manrope space-y-12 lg:space-y-0">
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

        {/* 세부항목 */}
        <div className="space-y-8 lg:space-y-0">
          {/* 마시멜로 */}
          <div className="lg:absolute lg:top-[35px] lg:left-[927px] w-full lg:w-[290px]">
            <div className="font-extrabold text-[1.1rem] lg:text-[1.25rem] leading-[1.8rem] mb-2">
              매일 마시멜로 굽기
            </div>
            <div className="font-medium text-slategray leading-[1.7rem] tracking-[-0.02em]">
              <p className="m-0">공부 시간이 늘어날수록</p>
              <p className="m-0">노릇노릇 맛있는 마시멜로를 구울 수 있어요!</p>
            </div>
          </div>

          {/* 그래프 */}
          <div className="lg:absolute lg:top-[260px] lg:left-[592px] w-full lg:w-[300px]">
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
          <div className="lg:absolute lg:top-[390px] lg:left-[125px] w-full lg:w-[320px]">
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
