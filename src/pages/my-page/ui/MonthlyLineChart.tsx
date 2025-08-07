//MonthlyLineChart.tsx
import type { FunctionComponent } from 'react';
import styles from './MonthlyLineChart.module.css';

// (예시) 백엔드에서 받아올 데이터 구조
const mockMonthlyData = {
  // 1일, 5일, 10일, 15일, 20일, 25일, 30일
  thisMonth: [3, 7, 11, 8, 6, 4, 2], // 이번 달 값 (ex: 공부 시간)
  lastMonth: [2, 4, 7, 7, 4, 2, 3], // 지난 달 값 (동일 좌표계)
};

const MAX_Y = 12;
const CHART_HEIGHT = 340;
const POINTS = [1, 5, 10, 15, 20, 25, 30]; // x축 레이블
const CHART_WIDTH = 835; // 피그마 기준, 라인 svg/w 크기와 동일하게

// 라인차트의 svg 좌표 변환 함수
function getLinePoints(arr: number[]) {
  // data는 왼쪽~오른쪽 순
  return arr
    .map((v, i) => {
      const x = (CHART_WIDTH / (arr.length - 1)) * i;
      const y = CHART_HEIGHT - (v / MAX_Y) * CHART_HEIGHT;
      return `${x},${y}`;
    })
    .join(' ');
}

const MonthlyLineChart: FunctionComponent = () => {
  // 실제 개발에선 props/data로 받아오는 구조 추천. 여기선 mock.
  const { thisMonth, lastMonth } = mockMonthlyData;

  return (
    <div className={styles.monthlylinechart}>
      {/* 범례 및 제목 */}
      <div className={styles.legendBox}>
        <span className={styles.box2}></span>
        <span className={styles.legendNow}>이번 달</span>
        <span className={styles.box1}></span>
        <span className={styles.legendPrev}>지난 달</span>
      </div>
      <div className={styles.title}>월별 공부 시간 통계</div>
      <div className={styles.chart}>
        {/* y축 라벨 */}
        <div className={styles.yLabels}>
          {[12, 10, 8, 6, 4, 2, 0].map((y) => (
            <span
              key={y}
              style={{
                position: 'absolute',
                left: '-35px',
                bottom: `${(y / MAX_Y) * CHART_HEIGHT - 6}px`,
              }}
            >
              {y}
            </span>
          ))}
        </div>
        {/* 점선 가이드 라인 */}
        {[0, 2, 4, 6, 8, 10, 12].map((y) => (
          <div
            key={y}
            className={styles.guideLine}
            style={{
              bottom: `${(y / MAX_Y) * CHART_HEIGHT}px`,
              left: '0',
              width: `${CHART_WIDTH}px`,
            }}
          />
        ))}
        {/* X축 날짜 레이블 */}
        <div className={styles.xLabels}>
          {POINTS.map((d, i) => (
            <span
              key={d}
              style={{
                left: `calc(${(CHART_WIDTH / (POINTS.length - 1)) * i}px - 15px)`,
              }}
            >{`${d}일`}</span>
          ))}
        </div>
        {/* SVG 라인 (지난 달) */}
        <svg
          className={styles.lineSVG}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          style={{ position: 'absolute', left: 0, bottom: 0 }}
        >
          <polyline
            fill="none"
            stroke="#e3e3e4"
            strokeWidth="4"
            strokeDasharray="7"
            points={getLinePoints(lastMonth)}
          />
        </svg>
        {/* SVG 라인 (이번 달) */}
        <svg
          className={styles.lineSVG}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          style={{ position: 'absolute', left: 0, bottom: 0 }}
        >
          <polyline
            fill="none"
            stroke="#34b3f1"
            strokeWidth="4"
            points={getLinePoints(thisMonth)}
          />
          {/* 강조점 및 오늘값 등 포인트 */}
          {thisMonth.map((v, i) => (
            <circle
              key={i}
              cx={(CHART_WIDTH / (thisMonth.length - 1)) * i}
              cy={CHART_HEIGHT - (v / MAX_Y) * CHART_HEIGHT}
              r={i === 2 ? 11 : 7} // 예시: 3번째(10일)에 강조점
              fill={i === 2 ? '#1f94ff' : '#34b3f1'}
              stroke="#fff"
              strokeWidth={3}
            />
          ))}
          {/* 포인트 라벨 (ex: 말풍선) */}
          <text
            x={(CHART_WIDTH / (thisMonth.length - 1)) * 2}
            y={CHART_HEIGHT - (thisMonth[2] / MAX_Y) * CHART_HEIGHT - 16}
            className={styles.dataLabel}
            textAnchor="middle"
          >
            10일
          </text>
        </svg>
      </div>
    </div>
  );
};

export default MonthlyLineChart;
