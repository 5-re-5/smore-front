import type { FC } from 'react';

// features
import ProfileCard from '@/features/my-page/graphs/ui/ProfileCard';
import AiFocusLineChart from '@/features/my-page/graphs/ui/AiFocusLineChart';
import StatPanel from '@/features/my-page/graphs/ui/StatPanel';
import MonthlyLineChart from '@/features/my-page/graphs/ui/MonthlyLineChart';
import WeeklyBarChartToggle from '@/features/my-page/graphs/ui/WeeklyBarChartToggle';

const MyPage: FC = () => {
  // localStorage에서 userId를 안전하게 가져오기
  // SSR 환경에서는 undefined 체크 필요!
  const userId =
    typeof window !== 'undefined' ? (localStorage.getItem('userId') ?? '') : '';

  return (
    <main
      className="
        max-w-[1440px] w-full min-h-screen
        mx-auto px-12 py-16
        bg-[#EBF3FF]
        flex flex-col items-center
        box-border overflow-x-visible
      "
    >
      {/* 고정 헤더 */}
      <div className="w-full mb-10">{/* 헤더 자리 */}</div>

      {/* 프로필 카드 */}
      <section className="w-full max-w-[1200px] mx-auto">
        <ProfileCard userId={userId} />
      </section>

      {/* 메인 콘텐츠 */}
      <section
        className="
          w-full max-w-[1200px] mx-auto
          flex flex-col gap-40
          mt-14 pb-48
          min-h-[900px]
        "
      >
        <AiFocusLineChart userId={userId} />
        <StatPanel userId={userId} />
        <WeeklyBarChartToggle userId={userId} />
        <MonthlyLineChart userId={userId} />
      </section>

      {/* 푸터 */}
      <footer
        className="
          w-full max-w-[1200px] mx-auto
          mt-32 text-center
          text-gray-500 text-sm
        "
      >
        {/* 푸터 자리 */}
      </footer>
    </main>
  );
};

export default MyPage;
