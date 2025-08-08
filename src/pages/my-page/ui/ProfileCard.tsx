import type { FunctionComponent } from 'react';

const ProfileCard: FunctionComponent = () => {
  return (
    <div
      className="
      w-[1200px] h-[700px]
      bg-aliceblue
      shadow-[-10px_-10px_20px_#fff,_10px_10px_20px_rgba(0,_0,_0,_0.09)]
      rounded-[25px]
      relative
      text-left text-[1.5rem] text-dimgray font-montserrat
      mx-auto
      flex flex-col
      justify-start
      items-center
    "
    >
      {/* 상단 3개 영역: 프로필, 텍스트, 음각박스 */}
      <div className="w-full flex flex-row items-start justify-between pt-16 pr-8">
        {/* 1. 프로필 이미지 (좌측) */}
        <img
          className="w-[180px] h-[180px] rounded-[45px] object-cover ml-[56px]" // <== 하단 left와 "일치"시키기 위해 left margin을 56px로!
          alt=""
          src="프로필 이미지.png"
        />

        {/* 2. 출석/닉네임 영역(중앙) */}
        <div className="flex flex-col justify-center items-start min-w-[220px] relative h-[180px] ml-8">
          <b className="mb-3 block tracking-[0.01em] leading-[133.4%] h-[36px]">
            연속 25일 출석!
          </b>
          <b className="text-[2rem] text-darkslategray block mb-3 tracking-[0.01em] leading-[133.4%] h-[32px]">
            김종운
          </b>
          <b className="block tracking-[0.01em] leading-[133.4%] text-lightseagreen h-[34px]">
            토익 스피킹 IH 취득
          </b>
        </div>

        {/* 3. 음각(우측) 영역 카드 */}
        <div
          className="
            relative
            w-[450px] h-[190px]
            flex-shrink-0
            flex flex-col items-center
            rounded-[43px]
            bg-aliceblue
            shadow-[-8px_-8px_16px_#fff_inset,_8px_8px_16px_#d0d3d7_inset]
            mr-[56px]  // 박스 오른쪽 공간도 동일하게 균형
          "
          style={{ left: 0 }} // left 속성 없거나 값이 0이면 x축 정렬 보장
        >
          <img
            className="absolute top-[-18px] left-[160px] rounded-[141px] w-[150px] h-[45px]"
            alt=""
            src="등급 버튼.svg"
          />
          <b className="absolute top-[12px] left-[202px] tracking-[0.01em] leading-[133.4%] text-[1.25rem]">
            <span>O</span>
            <span className="text-darkgray">rerere</span>
            <span>O</span>
          </b>
        </div>
      </div>

      {/* 하단(absolute 박스라인) - 동일 left값(56px)로 두 영역의 좌측 정렬이 "정확히 맞음" */}
      <div
        className="
        absolute left-[56px] top-[350px]
        w-[1087px] h-[286px] flex flex-row items-start justify-start
        pt-[22px] pb-[24px] pl-[22px] pr-[24px] box-border
      "
      >
        <div className="w-full h-full absolute m-0 top-0 right-0 bottom-0 left-0 z-[0]">
          <div className="absolute h-full w-full top-0 right-0 bottom-0 left-0 shadow-[-1px_-1px_0px_#fff_inset,_-2px_-2px_2px_#b8cce0_inset,_-1px_-1px_0px_#fff,_-2px_-2px_2px_#b8cce0] rounded-[32px] bg-aliceblue" />
        </div>
      </div>
      <div className="absolute top-[300px] left-[56px] tracking-[0.01em] leading-[133.4%] font-semibold text-darkslategray inline-block w-[200px] h-[40px]">
        마시멜로 굽기
      </div>
      <div className="absolute top-[318px] left-[1018px] text-[0.875rem] tracking-[-0.02em] leading-[100%] font-medium font-dm-sans text-gray">
        최근 1년 간 공부 기록
      </div>
    </div>
  );
};

export default ProfileCard;
