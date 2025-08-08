import React from 'react';

import ProfileCard from './ProfileCard';
import AiFocusLineChart from './AiFocusLineChart';
import StatPanel from './StatPanel';
import MonthlyLineChart from './MonthlyLineChart';
import WeeklyBarChartToggle from './WeeklyBarChartToggle';

const MyPage: React.FC = () => {
  return (
    <main className="max-w-[1440px] w-full min-h-screen mx-auto px-12 py-16 bg-[#EBF3FF] flex flex-col items-center box-border overflow-x-visible">
      {/* 고정 헤더 영역 */}
      <div className="w-full mb-10">{/* 헤더 컴포넌트 또는 자리 */}</div>

      {/* 프로필 */}
      <div className="w-full max-w-[1200px] mx-auto">
        <ProfileCard />
      </div>

      {/* 자식 컴포넌트들 */}
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-40 mt-14 pb-48 min-h-[900px]">
        <AiFocusLineChart userId="1" />
        <StatPanel />
        {/* 토글 그래프 컴포넌트 */}
        <WeeklyBarChartToggle userId="1" />
        <MonthlyLineChart userId="1" />
      </div>

      {/* 푸터 */}
      <footer className="w-full max-w-[1200px] mx-auto mt-32 text-center text-gray-500 text-sm">
        {/* 푸터 컴포넌트 또는 텍스트 */}
      </footer>
    </main>
  );
};

export default MyPage;
