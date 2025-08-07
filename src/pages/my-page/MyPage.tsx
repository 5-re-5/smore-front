// src/pages/my-page/MyPage.tsx
import styles from './MyPage.module.css';

import ProfileCard from './ui/ProfileCard';
import AiFocusLineChart from './ui/AiFocusLineChart';
import StatPanel from './ui/StatPanel';
import WeeklyBarChart from './ui/WeeklyBarChart';
import MonthlyLineChart from './ui/MonthlyLineChart';

const MyPage = () => {
  return (
    <main className={styles.myPage}>
      <div className={styles.headerWrap}>{/* 고정 헤더 분리 가능 */}</div>

      {/* ProfileCard는 section 없이 바로 렌더링 (흰색박스 제거) */}
      <ProfileCard />

      {/* 나머지는 기존대로 section 래핑 유지 */}
      <section className={styles.section}>
        <AiFocusLineChart />
      </section>
      <section className={styles.section}>
        <StatPanel />
      </section>
      <section className={styles.section}>
        <WeeklyBarChart />
      </section>
      <section className={styles.section}>
        <MonthlyLineChart />
      </section>

      <div className={styles.footerWrap}>{/* 고정 푸터 분리 가능 */}</div>
    </main>
  );
};

export default MyPage;
