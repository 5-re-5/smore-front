import type { FC } from 'react';

import ProfileCard from '@/features/my-page/graphs/ui/ProfileCard';
import AiFocusLineChart from '@/features/my-page/graphs/ui/AiFocusLineChart';
import StatPanel from '@/features/my-page/graphs/ui/StatPanel';
import MonthlyLineChart from '@/features/my-page/graphs/ui/MonthlyLineChart';
import WeeklyBarChartToggle from '@/features/my-page/graphs/ui/WeeklyBarChartToggle';

const MyPage: FC = () => {
  const userId =
    typeof window !== 'undefined'
      ? (() => {
          const stored = localStorage.getItem('auth-storage');
          if (!stored) return '';
          try {
            const parsed = JSON.parse(stored);
            return parsed?.state?.userId ?? '';
          } catch {
            console.error('auth-storage 파싱 에러');
            return '';
          }
        })()
      : '';

  console.log('[DEBUG] MyPage userId:', userId);

  return (
    <main
      className="
        w-full min-h-screen
        mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16
        bg-[#EBF3FF]
        flex flex-col items-center
        box-border overflow-x-hidden
      "
      style={{ maxWidth: '1440px' }}
    >
      {/* 고정 헤더 */}
      <div className="w-full mb-10">{/* 헤더 자리 */}</div>

      {/* 프로필 카드 */}
      <section className="w-full max-w-[1200px] mx-auto px-2">
        <ProfileCard userId={userId} />
      </section>

      {/* 메인 콘텐츠 */}
      <section className="w-full max-w-[1200px] mx-auto px-2 flex flex-col gap-40 mt-14 pb-48 min-h-[900px]">
        <AiFocusLineChart userId={userId} />
        <StatPanel userId={userId} />
        <WeeklyBarChartToggle userId={userId} />
        <MonthlyLineChart userId={userId} />
      </section>

      {/* 푸터 */}
      <footer className="w-full max-w-[1200px] mx-auto mt-32 text-center text-gray-500 text-sm">
        {/* 푸터 자리 */}
      </footer>
    </main>
  );
};

export default MyPage;
