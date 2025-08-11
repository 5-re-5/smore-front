import React, { useEffect, useState } from 'react';
// import { getAiFocusInsights } from "../api/AiFocusLineChartApi";
import type { AiInsights } from '../types/AiFocusLineChartTypes';

interface AiFocusLineChartProps {
  userId: string;
}

// API 실패시 사용되는 목데이터
const mockData: AiInsights = {
  feedback:
    '아침형 스타일입니다. 등교 전 오전에 50분 집중 후 10분 휴식을 추천드립니다 😊',
  average_focus_duration: 180,
  focus_track: {
    labels: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
    scores: [
      80, 76, 81, 78, 85, 74, 92, 79, 75, 82, 88, 70, 69, 74, 80, 76, 86, 83,
      72, 77, 90, 91, 81, 79,
    ],
  },
};

const AiFocusLineChart: React.FC<AiFocusLineChartProps> = ({ userId }) => {
  const [aiInsights, setAiInsights] = useState<AiInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 임시로 API 호출을 주석 처리하고 목데이터로 세팅
    /*
    getAiFocusInsights(userId)
      .then((res) => {
        console.log('📢 API Response JSON:', res);
        setAiInsights(res.data.ai_insights);
      })
      .catch((err) => {
        console.error('API 요청 실패:', err);
      });
    */
    setAiInsights(mockData);
    setLoading(false);
  }, [userId]);

  if (loading || !aiInsights) return <div>로딩 중...</div>;

  const { feedback, focus_track, average_focus_duration } = aiInsights;
  const { labels, scores } = focus_track;

  const maxIdx = scores.reduce((max, s, i, arr) => (s > arr[max] ? i : max), 0);

  const baseLeft = 5.009 * 16;
  const baseTop = 3.464 * 16;
  const graphHeight = 13.631 * 16;
  const graphWidth = 65.775 * 16;
  const minScore = 0;
  const maxScore = 100;
  const stepX = graphWidth / (labels.length - 1);

  const yPx = (s: number) =>
    baseTop +
    graphHeight -
    ((s - minScore) / (maxScore - minScore)) * graphHeight;
  const pointsStr = scores
    .map((s, i) => `${baseLeft + i * stepX},${yPx(s)}`)
    .join(' ');

  const hourLabelsToShow = labels.filter((_, i) => i % 2 === 0);

  return (
    <div className="w-full relative shadow-[6px_6px_54px_rgba(0,_0,_0,_0.05)] rounded-[25px] bg-white h-[37.5rem] flex flex-col items-start justify-start p-[2.5rem] box-border gap-[2.187rem] text-left text-[1.5rem] text-darkslategray-200 font-nunito-sans">
      {/* AI 피드백 */}
      <div className="w-[75rem] font-semibold font-montserrat text-darkslategray-100">
        AI 피드백
      </div>
      <div className="w-[75rem] text-[1rem] font-semibold font-montserrat text-dimgray">
        {feedback}
      </div>
      <b className="w-[75rem] text-gray-200">
        <span>AI 집중도 분석 </span>
        <span className="text-[1.25rem] text-dimgray">(한달 평균)</span>
      </b>

      {/* 그래프 영역 */}
      <div className="w-[70.781rem] relative h-[19.4rem] text-center text-[0.75rem]">
        <div className="absolute w-full h-full">
          {/* 세로축 */}
          <div className="absolute top-[16.47rem] left-0">20점</div>
          <div className="absolute top-[12.353rem] left-0">40점</div>
          <div className="absolute top-[8.235rem] left-0">60점</div>
          <div className="absolute top-[4.118rem] left-0">80점</div>
          <div className="absolute top-0 left-0">100점</div>

          {/* X축 라벨 (2시간 간격) */}
          {hourLabelsToShow.map((label) => {
            const i = labels.indexOf(label);
            return (
              <div
                key={label}
                className="absolute font-semibold"
                style={{
                  top: `${18.8}rem`,
                  left: `calc(${4.266 + (i * stepX) / 16}rem)`,
                }}
              >
                {label}시
              </div>
            );
          })}

          {/* SVG 라인차트 */}
          <svg
            className="absolute top-[3.464rem] left-[5.009rem]"
            width={graphWidth}
            height={graphHeight}
          >
            {/* 라인 */}
            <polyline
              fill="none"
              stroke="#34b3f1"
              strokeWidth={6}
              strokeLinejoin="round"
              strokeLinecap="round"
              points={scores.length >= 2 ? pointsStr : ''}
              opacity={0.7}
            />
            {/* 점 */}
            {scores.map((score, i) => (
              <circle
                key={i}
                cx={i * stepX}
                cy={yPx(score) - baseTop}
                r={i === maxIdx ? 12 : 7}
                fill={i === maxIdx ? '#1971c2' : '#34b3f1'}
                stroke="#fff"
                strokeWidth={i === maxIdx ? 5 : 3}
              />
            ))}
            {/* 최고 집중도 라벨 */}
            <text
              x={maxIdx * stepX}
              y={yPx(scores[maxIdx]) - baseTop - 40}
              textAnchor="middle"
              fill="#1971c2"
              fontWeight={700}
              fontSize={17}
              fontFamily="Montserrat"
              dominantBaseline="hanging"
            >
              최고 집중도
            </text>
          </svg>
        </div>
      </div>

      {/* 총 공부시간 */}
      <div className="w-[13.125rem] absolute top-[10.938rem] left-[60.188rem] h-[2.513rem] text-right text-[1.125rem]">
        <div className="absolute rounded-[5.2px] bg-gray-100 border-lightgray border-solid border-[0.8px] w-full h-full" />
        <div className="absolute top-[0.908rem] left-[1.489rem] font-semibold">
          총 공부시간 {average_focus_duration}분
        </div>
      </div>
    </div>
  );
};

export default AiFocusLineChart;
