//AiFocusLineChart.tsx
import type { FunctionComponent } from 'react';
import styles from './AiFocusLineChart.module.css';

// EXAMPLE: 목데이터, 추후 백엔드 연동 시 아래 focusData 배열만 교체!
const focusGraphData = [
  22, 38, 52, 41, 33, 89, 51, 47, 36, 65, 18, 25, 42, 58, 33, 72, 54, 65, 49,
  59, 60, 41, 27, 28,
]; // 24시간, 2시~22시까지 시간당 집중도 점수(0~100 기준)

const hours = [
  '00시',
  '02시',
  '04시',
  '06시',
  '08시',
  '10시',
  '12시',
  '14시',
  '16시',
  '18시',
  '20시',
  '22시',
];

const yTicks = [20, 40, 60, 80, 100];
const CHART_WIDTH = 1132.5;
const CHART_HEIGHT = 310.4;
const MAX_SCORE = 100;

// focusGraphData가 24개가 아니라 12개라면(2시간 단위)여도, 동일한 X간격으로 변환
function getLinePoints(data: number[]) {
  const N = data.length - 1;
  return data
    .map((v, i) => {
      const x = (CHART_WIDTH / N) * i;
      const y = CHART_HEIGHT - (v / MAX_SCORE) * CHART_HEIGHT;
      return `${x},${y}`;
    })
    .join(' ');
}

const AiFocusLineChart: FunctionComponent = () => {
  // 최고 집중도점 강조(예시: 최고치)
  const maxIdx = focusGraphData.indexOf(Math.max(...focusGraphData));
  const N = focusGraphData.length - 1;

  return (
    <div className={styles.aifocuslinechart}>
      <div className={styles.ai}>AI 피드백</div>
      <div className={styles.desc}>
        아침형 스타일입니다.
        <br />
        등교 전 오전에 50분 집중 후 10분 휴식을 취하는 방식을 추천드립니다 😀
      </div>
      <b className={styles.aiContainer}>
        <span>AI 집중도 분석 </span>
        <span className={styles.span}>(한달 평균)</span>
      </b>
      <div className={styles.graphWrapper}>
        {/* Y축 라벨 */}
        {yTicks.map((t) => (
          <span
            key={t}
            className={styles.yLabel}
            style={{ left: 0, bottom: `${(t / MAX_SCORE) * CHART_HEIGHT}px` }}
          >{`${t}점`}</span>
        ))}
        {/* X축 라벨 */}
        <div className={styles.xLabels}>
          {hours.map((H, i) => (
            <span
              key={H}
              className={styles.xLabel}
              style={{
                left: `calc(${(CHART_WIDTH / (hours.length - 1)) * i}px - 13px)`,
              }}
            >
              {H}
            </span>
          ))}
        </div>
        {/* 점선 그리드 */}
        {yTicks.map((t) => (
          <div
            key={`gl${t}`}
            className={styles.guideLine}
            style={{
              left: 60,
              bottom: `${(t / 100) * CHART_HEIGHT}px`,
              width: CHART_WIDTH,
            }}
          />
        ))}
        {/* SVG 라인 */}
        <svg
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          className={styles.svgLine}
          style={{ position: 'absolute', left: 60, bottom: 28 }}
        >
          <polyline
            fill="none"
            stroke="#34b3f1"
            strokeWidth="6"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={getLinePoints(focusGraphData)}
          />
          {/* 라인 위 점 (ex: 최고점만 강조, 나머지는 작은 점) */}
          {focusGraphData.map((v, i) => (
            <circle
              key={i}
              cx={(CHART_WIDTH / N) * i}
              cy={CHART_HEIGHT - (v / MAX_SCORE) * CHART_HEIGHT}
              r={i === maxIdx ? 12 : 7}
              fill={i === maxIdx ? '#1971c2' : '#34b3f1'}
              stroke="#fff"
              strokeWidth={i === maxIdx ? 5 : 3}
            />
          ))}
          {/* 최고 집중도 라벨(말풍선 효과) */}
          <text
            x={(CHART_WIDTH / N) * maxIdx}
            y={
              CHART_HEIGHT - (focusGraphData[maxIdx] / 100) * CHART_HEIGHT - 40
            }
            textAnchor="middle"
            className={styles.maxScoreLabel}
          >
            최고 집중도
          </text>
        </svg>
      </div>
      {/* 우측 하단 총 공부시간(예시) */}
      <div className={styles.totalStudyTime}>총 공부시간 78시간</div>
    </div>
  );
};

export default AiFocusLineChart;
