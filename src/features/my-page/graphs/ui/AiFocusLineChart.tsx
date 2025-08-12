import React from 'react';
import { useAiFocusInsights } from '../model/useAiFocusInsights';

interface AiFocusLineChartProps {
  userId: string;
}

const AiFocusLineChart: React.FC<AiFocusLineChartProps> = ({ userId }) => {
  const { data: aiInsights, loading } = useAiFocusInsights(userId);

  if (loading) {
    return (
      <div className="w-full max-w-full shadow rounded-[25px] bg-white min-h-[20rem] flex items-center justify-center">
        로딩 중...
      </div>
    );
  }
  if (!aiInsights) {
    return (
      <div className="w-full max-w-full shadow rounded-[25px] bg-white min-h-[20rem] flex items-center justify-center">
        데이터가 없습니다.
      </div>
    );
  }

  const { feedback, focusTrack, averageFocusDuration } = aiInsights;
  const { labels, scores } = focusTrack;

  // 그래프 계산
  const maxIdx = scores.reduce((m, s, i, arr) => (s > arr[m] ? i : m), 0);
  const baseLeft = 80; // px
  const baseTop = 55; // px
  const graphHeight = 218; // px
  const graphWidth = 1052; // px
  const minScore = 0;
  const maxScore = 100;
  const stepX = graphWidth / (labels.length - 1);

  const yPx = (s: number) =>
    baseTop +
    graphHeight -
    ((s - minScore) / (maxScore - minScore)) * graphHeight;

  const points = scores.map((score, i) => ({
    x: baseLeft + i * stepX,
    y: yPx(score),
  }));
  const hourLabelsToShow = labels.filter((_, i) => i % 2 === 0);

  const areaPoints = [
    ...scores.map((s, i) => `${baseLeft + i * stepX},${yPx(s)}`),
    `${baseLeft + (labels.length - 1) * stepX},${baseTop + graphHeight}`,
    `${baseLeft},${baseTop + graphHeight}`,
  ].join(' ');

  const POINT_RADIUS = 4.5;

  return (
    <div className="w-full max-w-full shadow-[6px_6px_54px_rgba(0,0,0,0.05)] rounded-[25px] bg-white flex flex-col p-6 gap-6 text-left font-nunito-sans">
      {/* AI 피드백 헤더 */}
      <div className="w-full max-w-[75rem] font-montserrat font-semibold text-darkslategray-100 text-[clamp(1.2rem,1.8vw,1.5rem)]">
        AI 피드백
      </div>
      {/* 피드백 내용 */}
      <div className="w-full max-w-[75rem] font-montserrat font-semibold text-dimgray text-[clamp(0.9rem,1.5vw,1rem)]">
        {feedback}
      </div>

      {/* 분석 제목 + 총 공부시간 */}
      <div className="w-full max-w-[75rem] flex items-center justify-between flex-wrap gap-2">
        <b className="text-gray-200 text-[clamp(1rem,1.5vw,1.25rem)]">
          <span className="text-[clamp(1.2rem,2vw,1.5rem)] font-semibold">
            AI 집중도 분석{' '}
          </span>
          <span className="text-[clamp(1rem,1.5vw,1.25rem)] text-dimgray font-semibold">
            (한달 평균)
          </span>
        </b>
        <div className="relative flex-shrink-0 flex items-center justify-center w-[13rem] h-[2.5rem]">
          <div className="absolute inset-0 rounded-[5.2px] bg-gray-100 border border-lightgray" />
          <span className="relative font-semibold text-[clamp(0.9rem,1vw,1.125rem)] text-gray-200 flex items-center justify-center w-full h-full">
            총 공부시간 {averageFocusDuration}분
          </span>
        </div>
      </div>

      {/* 그래프 영역 */}
      <div
        className="w-full max-w-[70rem] relative text-center font-montserrat"
        style={{
          aspectRatio: `${graphWidth + baseLeft} / ${graphHeight + baseTop}`,
        }}
      >
        {/* Y축 라벨 - 비율 기반 반응형 렌더 */}
        {[100, 80, 60, 40, 20].map((val) => {
          const yPos = (1 - val / maxScore) * graphHeight + baseTop;
          return (
            <div
              key={val}
              className="absolute font-semibold text-darkslategray-100"
              style={{
                top: `${(yPos / (graphHeight + baseTop)) * 100}%`,
                left: 0,
                transform: 'translateY(-50%)',
              }}
            >
              {val}점
            </div>
          );
        })}

        {/* X축 라벨 */}
        {hourLabelsToShow.map((label) => {
          const idx = labels.indexOf(label);
          const xPos = baseLeft + idx * stepX;
          return (
            <div
              key={label}
              className="absolute font-semibold text-darkslategray-100"
              style={{
                bottom: 0,
                left: `${(xPos / (graphWidth + baseLeft)) * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {label}시
            </div>
          );
        })}

        {/* SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${graphWidth + baseLeft} ${graphHeight + baseTop}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="focusAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34b3f1" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#34b3f1" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <polygon points={areaPoints} fill="url(#focusAreaGrad)" opacity={1} />
          <polyline
            fill="none"
            stroke="#34b3f1"
            strokeWidth={6}
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points.map((pt) => `${pt.x},${pt.y}`).join(' ')}
            opacity={0.9}
          />
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={POINT_RADIUS}
              fill={i === maxIdx ? '#1971c2' : '#34b3f1'}
              stroke="#fff"
              strokeWidth={i === maxIdx ? 3 : 2}
            />
          ))}
          {/* 최고 집중도 표시 */}
          {scores.length > 0 && (
            <g>
              <rect
                x={points[maxIdx].x - 50}
                y={points[maxIdx].y - 60}
                width="100"
                height="32"
                rx="16"
                fill="#1971c2"
                opacity="0.95"
                stroke="#fff"
                strokeWidth="2"
              />
              <text
                x={points[maxIdx].x}
                y={points[maxIdx].y - 44}
                textAnchor="middle"
                fill="#fff"
                fontWeight={700}
                fontSize={16}
                fontFamily="Montserrat"
                dominantBaseline="middle"
              >
                최고 집중도
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default AiFocusLineChart;
