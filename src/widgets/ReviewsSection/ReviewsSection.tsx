const ReviewsSection = () => {
  return (
    <section className="relative w-full py-20 bg-white font-rubik">
      {/* 타이틀 그룹 */}
      <div className="text-center mb-14">
        <h2
          className="text-[4rem] font-black"
          style={{
            fontFamily: '"Black Han Sans", sans-serif',
            color: '#0063E5',
          }}
        >
          <span style={{ color: '#0063E5' }}>S’m</span>
          <span style={{ color: '#F75804' }}>o</span>
          <span style={{ color: '#0063E5' }}>re</span>
        </h2>
        <p className="mt-3 text-[2.3rem] font-bold font-manrope text-gray tracking-[-0.03em] leading-[3rem]">
          수많은 이용자들의 만족 후기
        </p>
      </div>

      {/* 카드 컨테이너 */}
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-center gap-12">
        {/* 카드 1 */}
        <div className="w-[34.563rem] bg-white rounded-[32px] shadow-[inset_-1px_-1px_0px_#fff,inset_-2px_-2px_2px_#b8cce0,-1px_-1px_0px_#fff,-2px_-2px_2px_#b8cce0] overflow-hidden">
          {/* 상단 배경 이미지 */}
          <img
            src="/images/bg1.webp"
            alt="후기 배경1"
            className="w-full h-[20.75rem] object-cover rounded-t-[32px]"
          />
          {/* 프로필 */}
          <div className="relative px-8 -mt-10 flex items-center">
            <img
              src="/images/profile_img1.webp"
              alt="사용자1"
              className="w-[4.375rem] h-[4.375rem] rounded-full border-4 border-white shadow-md"
            />
            <div className="ml-4">
              <b className="block font-manrope text-[1.25rem]">
                Sophia Bennett
              </b>
              <span className="block text-[0.875rem] text-steelblue">
                San Diego, United States
              </span>
            </div>
          </div>
          {/* 후기 내용 */}
          <div className="px-8 mt-6 mb-8 text-[1.5rem] font-bold text-gray leading-[2.25rem]">
            <p className="m-0">“AI 집중도 분석 덕분에 공부에 집중할 수 있고</p>
            <p className="m-0">나에게 맞는 공부 방법도 추천해줘서 좋아요.”</p>
          </div>
        </div>

        {/* 카드 2 */}
        <div className="w-[34.563rem] bg-white rounded-[32px] shadow-[inset_-1px_-1px_0px_#fff,inset_-2px_-2px_2px_#b8cce0,-1px_-1px_0px_#fff,-2px_-2px_2px_#b8cce0] overflow-hidden">
          {/* 상단 배경 이미지 */}
          <img
            src="/images/bg2.webp"
            alt="후기 배경2"
            className="w-full h-[20.75rem] object-cover rounded-t-[32px]"
          />
          {/* 프로필 */}
          <div className="relative px-8 -mt-10 flex items-center">
            <img
              src="/images/profile_img2.webp"
              alt="사용자2"
              className="w-[4.375rem] h-[4.375rem] rounded-full border-4 border-white shadow-md"
            />
            <div className="ml-4">
              <b className="block font-manrope text-[1.25rem]">Lucas Martin</b>
              <span className="block text-[0.875rem] text-steelblue">
                Paris, France
              </span>
            </div>
          </div>
          {/* 후기 내용 */}
          <div className="px-8 mt-6 mb-8 text-[1.5rem] font-bold text-gray leading-[2.25rem] whitespace-pre-wrap">
            <p className="m-0">“노릇노릇한 마시멜로 그래프를 만들기 위해,</p>
            <p className="m-0">매일 꾸준히 스터디를 하게 됩니다.”</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
