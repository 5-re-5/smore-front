// src/pages/my-page/MyPage.tsx
import styles from '../MyPage.module.css';

import ProfileCard from './ProfileCard';
import AiFocusLineChart from './AiFocusLineChart';
import StatPanel from './StatPanel';
import WeeklyBarChart from './WeeklyBarChart';
import MonthlyLineChart from './MonthlyLineChart';

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
