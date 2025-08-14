import React from 'react';

import { Certification } from '@/shared/ui/icons/Certification';
import { Job } from '@/shared/ui/icons/Job';
import { Language } from '@/shared/ui/icons/Language';
import { Meeting } from '@/shared/ui/icons/Meeting';
import { School } from '@/shared/ui/icons/School';
import { SelfStudy } from '@/shared/ui/icons/SelfStudy';

// 카테고리별 카드 위치 및 아이콘 매핑
const categories = [
  { label: '취업', top: 30, left: 40, Icon: Job },
  { label: '자격증', top: 30, left: 170, Icon: Certification },
  { label: '어학', top: 160, left: 40, Icon: Language },
  { label: '회의', top: 160, left: 170, Icon: Meeting },
  { label: '학교공부', top: 290, left: 40, Icon: School },
  { label: '자율', top: 290, left: 170, Icon: SelfStudy },
];

const FeaturesSection = () => {
  return (
    <section className="relative w-full h-[782px] bg-whitesmoke font-inter text-royalblue overflow-hidden">
      {/* 배경 카드 */}
      <div className="absolute top-[118px] left-[140px] right-[140px] bottom-[65px] z-10">
        <div className="relative w-full h-full">
          {/* 바탕 라운드 카드 */}
          <div className="absolute inset-0 rounded-[32px] bg-whitesmoke shadow-[-1px_-1px_0px_#fff_inset,-2px_-2px_2px_#b8cce0_inset,-1px_-1px_0px_#fff,-2px_-2px_2px_#b8cce0]" />

          {/* [추가] 장식 PNG - 연필 (오른쪽 상단) */}
          <img
            src="/images/pencil_icon.png"
            alt="Pencil Icon"
            className="absolute top-[-120px] right-[-30px] w-[270px] h-[270px] z-30 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 animate-cardfloat"
            style={{ pointerEvents: 'auto' }}
          />

          {/* [추가] 장식 PNG - 종이 (왼쪽 하단) */}
          <img
            src="/images/paper_icon.png"
            alt="Paper Icon"
            className="absolute bottom-[-80px] left-[-95px] w-[230px] h-[230px] z-30 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 animate-cardfloat2"
            style={{ pointerEvents: 'auto' }}
          />

          {/* 왼쪽 반투명 박스 */}
          <div className="absolute left-[70px] top-[129px] w-[727px] h-[526px] rounded-[32px] bg-gray opacity-50 z-10" />

          {/* 오른쪽 패널 */}
          <div className="absolute left-[810px] top-[150px] w-[280px] h-[410px]">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-[32px] bg-aliceblue shadow-[-1px_-1px_0px_#fff_inset,-2px_-2px_2px_#b8cce0_inset,-1px_-1px_0px_#fff,-2px_-2px_2px_#b8cce0]" />

              {/* 버튼+아이콘+텍스트 */}
              {categories.map(({ label, top, left, Icon }) => (
                <React.Fragment key={label}>
                  {/* 아이콘 */}
                  <div
                    className="absolute flex items-center justify-center w-[60px] h-[32px]"
                    style={{
                      top: `${top + 15}px`, // 버튼보다 약간 위
                      left: `${left}px`,
                    }}
                  >
                    <Icon className="w-8 h-8 text-royalblue" />
                  </div>
                  {/* 버튼 */}
                  <button
                    className="absolute w-[60px] h-[60px] rounded-[14px] bg-aliceblue flex items-center justify-center shadow-[8px_8px_16px_#c9d9e8,-8px_-8px_16px_#fff] hover:bg-white transition"
                    style={{ top: `${top}px`, left: `${left}px` }}
                  />
                  {/* 텍스트 */}
                  <span
                    className="absolute w-[80px] text-center font-inter font-semibold text-royalblue text-[1.13rem] pointer-events-none"
                    style={{
                      top: `${top + 68}px`,
                      left: `${left - 10}px`,
                    }}
                  >
                    {label}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 동영상 카드 */}
          <div className="absolute left-[40px] top-[40px] w-[720px] h-[520px] rounded-[32px] bg-black shadow-[0_5px_26px_rgba(51,63,86,0.22)] flex items-center justify-center overflow-hidden z-20">
            <video
              src="/video/StudyVideo.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              style={{ borderRadius: '32px' }}
            />
          </div>

          {/* 카피 + 부제목 */}
          <div className="absolute top-[380px] left-[90px] z-30">
            <div className="text-[2.25rem] font-bold font-manrope text-white leading-tight mb-4 drop-shadow">
              다양한 카테고리의
              <br />
              스터디에 참여해보세요!
            </div>
            <div className="font-inter text-white/80 font-semibold text-[1.2rem] tracking-tighter">
              취업 / 자격증 / 어학 / 회의 / 학교공부 / 자율
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
