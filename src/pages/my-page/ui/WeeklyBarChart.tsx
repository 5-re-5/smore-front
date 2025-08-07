//WeeklyBarChart.tsx
import type { FunctionComponent } from 'react';
import styles from './WeeklyBarChart.module.css';

const weekday_graph = [6, 4, 2, 12, 4, 0, 3];
const maxValue = 12;
const dayLabels = ['일', '토', '금', '목', '수', '화', '월'];
const MAX_BAR_HEIGHT = 328; // px

const WeeklyBarChart: FunctionComponent = () => (
  <div className={styles.sectionWrap}>
    <div className={styles.title}>주간 공부 시간 통계</div>
    <div className={styles.chart}>
      {/* y축 숫자/라인 */}
      {[0, 2, 4, 6, 8, 10, 12].map((num) => (
        <div
          key={num}
          className={styles.yLabel}
          style={{ bottom: `${(num / maxValue) * MAX_BAR_HEIGHT}px` }}
        >
          {num}
        </div>
      ))}
      {[0, 2, 4, 6, 8, 10, 12].map((num) => (
        <div
          key={num}
          className={styles.guideLine}
          style={{ bottom: `${(num / maxValue) * MAX_BAR_HEIGHT}px` }}
        />
      ))}
      {/* bars: bottom: 0에서 위로 height만큼 자라게! */}
      <div className={styles.barsArea}>
        {weekday_graph.map((v, i) => (
          <div key={i} className={styles.barAndLabel}>
            <div
              className={styles.bar}
              style={{ height: `${(v / maxValue) * MAX_BAR_HEIGHT}px` }}
            >
              {v > 0 && <span className={styles.value}>{v}</span>}
            </div>
            <span className={styles.dayLabel}>{dayLabels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
export default WeeklyBarChart;
