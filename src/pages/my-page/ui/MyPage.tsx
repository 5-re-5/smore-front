// MyPage.tsx
import ProfileCard from './ProfileCard';
import MarshmallowHeatmap from './MarshmallowHeatmap';
import AiFocusLineChart from './AiFocusLineChart';
import StatPanel from './StatPanel';
import WeeklyBarChart from './WeeklyBarChart';
import WeeklyAvgBarChart from './WeeklyAvgBarChart';
import MonthlyLineChart from './MonthlyLineChart';
import { useState } from 'react';

export default function MyPage() {
  const [showAvg, setShowAvg] = useState(false);

  return (
    <div>
      {/* 1. 프로필 섹션 */}
      <ProfileCard />
      <MarshmallowHeatmap />

      {/* 2. 집중도 분석 섹션 */}
      <AiFocusLineChart />
      <StatPanel />

      {/* 3. 주간/주평균 그래프 전환 */}
      <div>
        <button onClick={() => setShowAvg(false)}>주간 통계</button>
        <button onClick={() => setShowAvg(true)}>주평균</button>
        {showAvg ? <WeeklyAvgBarChart /> : <WeeklyBarChart />}
      </div>

      {/* 4. 월별 그래프 */}
      <MonthlyLineChart />
    </div>
  );
}
