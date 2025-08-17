import React from 'react';
import { useAiFocusInsights } from '../model/useAiFocusInsights';
import StatPanel from './StatPanel';

interface AiFocusLineChartProps {
  userId: string;
}

const AiFocusLineChart: React.FC<AiFocusLineChartProps> = ({ userId }) => {
  const { data: aiInsights, loading } = useAiFocusInsights(userId);

  // 로딩 상태 표시
  if (loading) {
    return (
      <div
        className="w-full max-w-full shadow rounded-[25px] bg-white flex items-center justify-center"
        style={{ minHeight: '15rem' }}
      >
        로딩 중...
      </div>
    );
  }

  // 데이터 없을 때 표시
  if (
    !aiInsights ||
    !aiInsights.focusTrack ||
    !aiInsights.focusTrack.scores ||
    aiInsights.focusTrack.scores.every((score) => score === 0)
  ) {
    return (
      <>
        <div
          className="w-full max-w-full shadow rounded-[25px] bg-white flex items-center justify-center font-semibold"
          style={{ minHeight: '15rem', color: '#444' }}
        >
          데이터가 없습니다.
        </div>
      </>
    );
  }

  const {
    feedback,
    focusTrack,
    averageFocusDuration,
    bestFocusTime,
    worstFocusTime,
  } = aiInsights;
  const { labels, scores } = focusTrack;

  // 그래프 기본값 (px 단위)
  const maxIdx = scores.reduce((m, s, i, arr) => (s > arr[m] ? i : m), 0);
  const baseLeft = 80; // 그래프 좌측 시작 위치(px)
  const baseTop = 55; // 그래프 상단 시작 위치(px)
  const graphHeight = 218; // 그래프 높이(px)
  const graphWidth = 1052; // 그래프 너비(px)
  const minScore = 0;
  const maxScore = 100;
  const stepX = graphWidth / (labels.length - 1);

  // score 값에 따른 y 좌표 계산 함수
  const yPx = (s: number) =>
    baseTop +
    graphHeight -
    ((s - minScore) / (maxScore - minScore)) * graphHeight;

  // 좌표 리스트 생성
  const points = scores.map((score, i) => ({
    x: baseLeft + i * stepX,
    y: yPx(score),
  }));

  // x축 라벨은 2칸씩 띄워서 표시
  const hourLabelsToShow = labels.filter((_, i) => i % 2 === 0);

  // 영역 다각형 점 좌표 문자열
  const areaPoints = [
    ...scores.map((s, i) => `${baseLeft + i * stepX},${yPx(s)}`),
    `${baseLeft + (labels.length - 1) * stepX},${baseTop + graphHeight}`,
    `${baseLeft},${baseTop + graphHeight}`,
  ].join(' ');

  // 원 반지름
  const POINT_RADIUS = 4.5;

  return (
    <>
      {/* 흰색 카드 - 라인차트 */}
      <div
        className="w-full max-w-full shadow-[6px_6px_54px_rgba(0,0,0,0.05)] rounded-[25px] bg-white flex flex-col p-6 gap-6 text-left font-nunito-sans relative"
        style={{ minHeight: '40rem' }}
      >
        {/* AI 피드백 헤더 */}
        <div className="w-full max-w-[75rem] font-montserrat font-semibold text-black text-[clamp(1.2rem,1.8vw,1.5rem)]">
          AI 피드백
        </div>

        {/* 피드백 내용 */}
        <div
          className="w-full max-w-[75rem] font-montserrat font-semibold text-[clamp(0.9rem,1.5vw,1rem)]"
          style={{ color: '#4B4B4B' }}
        >
          {feedback}
        </div>

        {/* 분석 제목 + 총 공부시간 */}
        <div className="w-full max-w-[75rem] flex items-center justify-between flex-wrap gap-2">
          <b className="text-black text-[clamp(1rem,1.5vw,1.25rem)]">
            <span className="text-black text-[clamp(1.2rem,2vw,1.5rem)] font-semibold">
              AI 집중도 분석{' '}
            </span>
            <span
              className="text-[clamp(1rem,1.5vw,1.25rem)] font-semibold"
              style={{ color: '#4B4B4B' }}
            >
              (한달 평균)
            </span>
          </b>
          <div className="relative flex-shrink-0 flex items-center justify-center w-[13rem] h-[2.5rem]">
            <div className="absolute inset-0 rounded-[5.2px] bg-white border border-gray-300" />
            <span className="relative font-semibold text-black flex items-center justify-center w-full h-full text-[clamp(0.9rem,1vw,1.125rem)]">
              총 공부시간 {averageFocusDuration}분
            </span>
          </div>
        </div>

        {/* 그래프 영역 */}
        <div
          className="w-full max-w-[70rem] relative text-center font-montserrat"
          style={{
            aspectRatio: `${graphWidth + baseLeft} / ${graphHeight + baseTop}`,
            marginBottom: '2rem',
          }}
        >
          {/* Y축 라벨 */}
          {[100, 80, 60, 40, 20].map((val) => {
            const yPos = (1 - val / maxScore) * graphHeight + baseTop;
            return (
              <div
                key={val}
                className="absolute font-semibold"
                style={{
                  color: '#333',
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
                className="absolute font-semibold"
                style={{
                  color: '#333',
                  bottom: '-5rem',
                  left: `${(xPos / (graphWidth + baseLeft)) * 100}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {label}시
              </div>
            );
          })}

          {/* SVG 영역 */}
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
            <polygon
              points={areaPoints}
              fill="url(#focusAreaGrad)"
              opacity={1}
            />
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

      {/* 흰색 카드 밖, 아래쪽에 독립 배치 */}
      <div className="mt-8">
        <StatPanel
          bestFocusTime={bestFocusTime}
          worstFocusTime={worstFocusTime}
          averageFocusDuration={averageFocusDuration}
        />
      </div>
    </>
  );
};

export default AiFocusLineChart;
