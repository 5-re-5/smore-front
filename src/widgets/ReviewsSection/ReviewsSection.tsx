const ReviewsSection = () => {
  return (
    <section className="relative w-full py-20 bg-white font-rubik">
      {/* 타이틀 그룹 */}
      <div className="text-center mb-14">
        <h2 className="text-royalblue text-[4rem] font-black-han-sans">
          <span>S’m</span>
          <span className="text-orangered">o</span>
          <span>re</span>
        </h2>
        <p className="mt-3 text-[2.5rem] font-extrabold font-manrope text-gray tracking-[-0.03em] leading-[3rem]">
          수많은 이용자들의 만족 후기
        </p>
      </div>

      {/* 카드 컨테이너 */}
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-center gap-12">
        {/* 카드 1 */}
        <div className="w-[34.563rem] bg-white rounded-[32px] shadow-[inset_-1px_-1px_0px_#fff,inset_-2px_-2px_2px_#b8cce0,-1px_-1px_0px_#fff,-2px_-2px_2px_#b8cce0] overflow-hidden">
          {/* 상단 배경 이미지 */}
          <img
            src="/images/bg1.png"
            alt="후기 배경1"
            className="w-full h-[20.75rem] object-cover rounded-t-[32px]"
          />
          {/* 프로필 */}
          <div className="relative px-8 -mt-10 flex items-center">
            <img
              src="/images/profile_img1.png"
              alt="사용자1"
              className="w-[4.375rem] h-[4.375rem] rounded-full border-4 border-white shadow-md"
            />
            <div className="ml-4">
              <b className="block font-manrope text-[1.25rem]">Vanese Hudson</b>
              <span className="block text-[0.875rem] text-steelblue">
                Warsaw, Poland
              </span>
            </div>
          </div>
          {/* 후기 내용 */}
          <div className="px-8 mt-6 mb-8 text-[1.5rem] font-black text-gray leading-[2.25rem]">
            <p className="m-0">“화면 공유와 채팅 기능 덕분에 자료 공유가</p>
            <p className="m-0">편리하고, 질문도 바로 할 수 있어 만족합니다.”</p>
          </div>
        </div>

        {/* 카드 2 */}
        <div className="w-[34.563rem] bg-white rounded-[32px] shadow-[inset_-1px_-1px_0px_#fff,inset_-2px_-2px_2px_#b8cce0,-1px_-1px_0px_#fff,-2px_-2px_2px_#b8cce0] overflow-hidden">
          {/* 상단 배경 이미지 */}
          <img
            src="/images/bg2.png"
            alt="후기 배경2"
            className="w-full h-[20.75rem] object-cover rounded-t-[32px]"
          />
          {/* 프로필 */}
          <div className="relative px-8 -mt-10 flex items-center">
            <img
              src="/images/profile_img2.png"
              alt="사용자2"
              className="w-[4.375rem] h-[4.375rem] rounded-full border-4 border-white shadow-md"
            />
            <div className="ml-4">
              <b className="block font-manrope text-[1.25rem]">Tom Holton</b>
              <span className="block text-[0.875rem] text-steelblue">
                Warsaw, Poland
              </span>
            </div>
          </div>
          {/* 후기 내용 */}
          <div className="px-8 mt-6 mb-8 text-[1.5rem] font-black text-gray leading-[2.25rem] whitespace-pre-wrap">
            <p className="m-0">“다양한 그룹과 함께 공부하며 동기부여도 되고,</p>
            <p className="m-0">꾸준히 참여하게 되는 점이 정말 좋아요.”</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
