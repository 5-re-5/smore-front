//StatPanel.tsx
import type { FunctionComponent } from 'react';
import styles from './StatPanel.module.css';

const StatPanel: FunctionComponent = () => (
  <div className={styles.statpanel}>
    <div className={styles.panelSection}>
      <div className={styles.label}>최고 집중 시간대</div>
      <div className={styles.value}>오전 6시~오전8시</div>
    </div>
    <div className={styles.panelSection}>
      <div className={styles.label}>최저 집중 시간대</div>
      <div className={styles.value}>오후 1시~오후2시</div>
    </div>
    <div className={styles.panelSection}>
      <div className={styles.label}>평균 집중 유지 시간</div>
      <div className={styles.value}>1시간 5분</div>
    </div>
  </div>
);
export default StatPanel;
