//MarshmallowHeatmap.tsx
import type { FunctionComponent } from 'react';
import styles from './MarshmallowHeatmap.module.css';

// 예시: 7x15(열x행) 2D 배열, 실제 백엔드 데이터는 props로 받아도 됨
const days = Array(7).fill(0); // 요일
const weeks = Array(15).fill(0); // 15주

// 예시 잔디값(0~4: None~Deep)
const getRandom = () => Math.floor(Math.random() * 5);

const mockData: number[][] = Array(weeks.length)
  .fill(null)
  .map(() => Array(days.length).fill(0).map(getRandom));

const MarshmallowHeatmap: FunctionComponent = () => (
  <div className={styles.heatmapWrap}>
    <div className={styles.grid}>
      {mockData.map((week, xi) =>
        week.map((v, yi) => (
          <div
            key={xi + '-' + yi}
            className={`${styles.cell} ${styles['cell' + v]}`}
          />
        )),
      )}
    </div>
    <div className={styles.labelRow}>
      <span>월</span>
      <span>수</span>
      <span>금</span>
    </div>
    <div className={styles.intensityKey}>
      <span>Less</span>
      {[0, 1, 2, 3, 4].map((v) => (
        <span key={v} className={`${styles.colorKey} ${styles['cell' + v]}`} />
      ))}
      <span>More</span>
    </div>
  </div>
);

export default MarshmallowHeatmap;
