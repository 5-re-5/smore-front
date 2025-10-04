const ExtraFeaturesSection = () => {
  return (
    <section className="relative w-full h-[730px] bg-white font-black-han-sans overflow-hidden">
      {/* studyroom.webp/webp - 왼쪽 메인 이미지 */}
      <picture>
        <source srcSet="/images/studyroom.webp" type="image/webp" />
        <img
          src="/images/studyroom.webp"
          alt="스터디룸"
          className="absolute top-[61px] left-0 w-[830px] h-[571px] rounded-[7.2px] object-cover shadow-xl"
          style={{ zIndex: 1 }}
        />
      </picture>

      {/* 오른쪽: 섹션 타이틀 */}
      <div
        className="absolute top-[104px] left-[950px] text-left text-[2.75rem] leading-[56px] w-[430px]"
        style={{ fontFamily: '"Black Han Sans", sans-serif', color: '#656769' }}
      >
        <div>
          <span>S’m</span>
          <span style={{ color: '#76AAF8' }}>o</span>
          <span>re</span>에서 제공하는
        </div>
        <div>다양한 스터디룸 기능</div>
      </div>

      {/* 오른쪽 섹션: 박스 + 아이콘 + 텍스트. top으로 상하 조절  */}
      <div className="absolute top-[300px] left-[960px] flex flex-col gap-8">
        <div className="flex items-center gap-5">
          <div
            className="w-[60px] h-[60px] rounded-[10px] bg-ghostwhite flex items-center justify-center
                            shadow-[inset_0_-2px_2px_#d8dfe8,inset_0_2px_2px_#eff6ff,0_8px_16px_rgba(46,47,49,0.17)]"
          >
            <span className="text-[1.9rem]" role="img" aria-label="pomodoro">
              ⏲️
            </span>
          </div>
          <span className="text-[1.53rem] font-medium tracking-[-0.02em] font-black-han-sans">
            포모도로 시계
          </span>
        </div>
        <div className="flex items-center gap-5">
          <div
            className="w-[60px] h-[60px] rounded-[10px] bg-ghostwhite flex items-center justify-center
                            shadow-[inset_0_-2px_2px_#d8dfe8,inset_0_2px_2px_#eff6ff,0_8px_16px_rgba(46,47,49,0.17)]"
          >
            <span className="text-[1.9rem]" role="img" aria-label="stopwatch">
              ⏱️
            </span>
          </div>
          <span className="text-[1.53rem] font-medium tracking-[-0.02em] font-black-han-sans">
            스톱워치
          </span>
        </div>
        <div className="flex items-center gap-5">
          <div
            className="w-[60px] h-[60px] rounded-[10px] bg-ghostwhite flex items-center justify-center
                            shadow-[inset_0_-2px_2px_#d8dfe8,inset_0_2px_2px_#eff6ff,0_8px_16px_rgba(46,47,49,0.17)]"
          >
            <span className="text-[1.9rem]" role="img" aria-label="noise">
              🎵
            </span>
          </div>
          <span className="text-[1.53rem] font-medium tracking-[-0.02em] font-black-han-sans">
            화이트 노이즈
          </span>
        </div>
      </div>
    </section>
  );
};

export default ExtraFeaturesSection;
