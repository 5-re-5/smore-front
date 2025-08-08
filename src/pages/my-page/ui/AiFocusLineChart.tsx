import React, { useEffect, useState } from 'react';

type FocusTrack = {
  labels: string[];
  scores: number[];
};

type AiInsights = {
  feedback: string;
  best_focus_time: { start: string; end: string; avg_focus_score: number };
  worst_focus_time: { start: string; end: string; avg_focus_score: number };
  average_focus_duration: number;
  focus_track: FocusTrack;
};

type Props = {
  userId: string;
};

const AiFocusLineChart: React.FC<Props> = ({ userId }) => {
  const [aiInsights, setAiInsights] = useState<AiInsights | null>(null);
  const [loading, setLoading] = useState(true);

  // 목업 데이터: 2시간 단위/총 12개/0~100점
  const mockData: AiInsights = {
    feedback:
      '아침형 스타일입니다. 등교 전 오전에 50분 집중 후 10분 휴식을 취하는 방식을 추천드립니다 😀',
    best_focus_time: { start: '08:00', end: '10:00', avg_focus_score: 93 },
    worst_focus_time: { start: '16:00', end: '18:00', avg_focus_score: 53 },
    average_focus_duration: 120,
    focus_track: {
      labels: [
        '00',
        '02',
        '04',
        '06',
        '08',
        '10',
        '12',
        '14',
        '16',
        '18',
        '20',
        '22',
      ],
      scores: [60, 55, 48, 67, 86, 93, 90, 74, 53, 59, 72, 63],
    },
  };

  useEffect(() => {
    // 실제 백엔드 연동부 (주석)
    /*
    setLoading(true);
    fetch(`/api/v1/focus-records/${userId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("API 오류");
        const data: ApiResponse = await res.json();
        setAiInsights(data.data.ai_insights);
      })
      .catch(() => setAiInsights(mockData))
      .finally(() => setLoading(false));
    */
    // 목데이터 사용
    setAiInsights(mockData);
    setLoading(false);
  }, [userId]);

  if (loading || !aiInsights) return <div>로딩 중...</div>;

  // 그래프 그리기용 파라미터 (디자인·위치 값 절대 고정)
  const { feedback, focus_track } = aiInsights;
  const { labels, scores } = focus_track;
  const maxIdx = scores.reduce((max, s, i, arr) => (s > arr[max] ? i : max), 0);

  // 좌표(고정 px/rem값 맞춤)
  const baseLeft = 5.009 * 16; // rem단위 → px
  const baseTop = 3.464 * 16,
    graphHeight = 13.631 * 16,
    graphWidth = 65.775 * 16;
  const minScore = 0,
    maxScore = 100;
  const stepX = graphWidth / (labels.length - 1);
  const yPx = (s: number) =>
    baseTop +
    graphHeight -
    ((s - minScore) / (maxScore - minScore)) * graphHeight;
  const pointsStr = scores
    .map((s, i) => `${baseLeft + i * stepX},${yPx(s)}`)
    .join(' ');

  return (
    <div className="w-full relative shadow-[6px_6px_54px_rgba(0,_0,_0,_0.05)] rounded-[25px] bg-white h-[37.5rem] flex flex-col items-start justify-start p-[2.5rem] box-border gap-[2.187rem] text-left text-[1.5rem] text-darkslategray-200 font-nunito-sans">
      {/* 제목/피드백/… 모두 디자인 유지 */}
      <div className="w-[75rem] relative tracking-[0.01em] leading-[133.4%] font-semibold font-montserrat text-darkslategray-100 inline-block h-[2.181rem] shrink-0 z-[0]">
        AI 피드백
      </div>
      <div className="w-[75rem] relative text-[1rem] tracking-[0.01em] leading-[145%] font-semibold font-montserrat text-dimgray inline-block h-[2.5rem] shrink-0 z-[1]">
        {feedback}
      </div>
      <b className="w-[75rem] relative leading-[1.25rem] inline-block z-[2] text-gray-200">
        <span>AI 집중도 분석 </span>
        <span className="text-[1.25rem] text-dimgray">(한달 평균)</span>
      </b>

      {/* 그래프 영역 */}
      <div className="w-[70.781rem] relative h-[19.4rem] z-[3] text-center text-[0.75rem]">
        <div className="absolute top-[0rem] left-[0rem] w-[70.781rem] h-[19.4rem]">
          {/* 세로축(점수): 0~100점, 20점단위 라벨 디자인 그대로 배치 */}
          <div className="absolute top-[16.47rem] left-[0rem] leading-[0.563rem] font-semibold text-left inline-block w-[1.713rem] h-[0.625rem]">
            20점
          </div>
          <div className="absolute top-[12.353rem] left-[0rem] leading-[0.563rem] font-semibold text-left inline-block w-[1.713rem] h-[0.625rem]">
            40점
          </div>
          <div className="absolute top-[8.235rem] left-[0rem] leading-[0.563rem] font-semibold text-left inline-block w-[1.713rem] h-[0.625rem]">
            60점
          </div>
          <div className="absolute top-[4.118rem] left-[0rem] leading-[0.563rem] font-semibold text-left inline-block w-[1.713rem] h-[0.625rem]">
            80점
          </div>
          <div className="absolute top-[0rem] left-[0rem] leading-[0.563rem] font-semibold text-left inline-block w-[2.175rem] h-[0.625rem]">
            100점
          </div>
          {/* 가로축: 00, 02 … 22시 (labels)* (x좌표 계산 유지) */}
          {labels.map((label, i) => (
            <div
              key={label}
              className="absolute leading-[0.563rem] font-semibold inline-block"
              style={{
                top: `${18.8}rem`,
                left: `calc(${4.266 + (i * (graphWidth / (labels.length - 1))) / 16}rem)`,
                width: `${1.5 + 0.4 * (label.length > 1 ? 1 : 0)}rem`,
                height: '0.6rem',
              }}
            >
              {label}시
            </div>
          ))}
          {/* 라인 그래프 svg, Line/Point ... img 없음 */}
          <svg
            className="absolute top-[3.464rem] left-[5.009rem]"
            width={graphWidth}
            height={graphHeight}
            style={{ position: 'absolute' }}
          >
            <polyline
              fill="none"
              stroke="#34b3f1"
              strokeWidth={6}
              strokeLinejoin="round"
              strokeLinecap="round"
              points={scores.length >= 2 ? pointsStr : ''}
              opacity={0.7}
            />
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
            {/* 최고 집중도 텍스트 */}
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

      {/* 총 공부시간 등 디자인 고정 박스/글씨 */}
      <div className="w-[13.125rem] absolute top-[10.938rem] left-[60.188rem] h-[2.513rem] z-[4] text-right text-[1.125rem]">
        <div className="absolute top-[0rem] left-[0rem] rounded-[5.2px] bg-gray-100 border-lightgray border-solid border-[0.8px] box-border w-[13.125rem] h-[2.513rem]" />
        <div className="absolute top-[0.908rem] left-[1.489rem] w-[9.619rem] h-[0.7rem]">
          <div className="absolute top-[0rem] left-[0rem] leading-[0.625rem] font-semibold inline-block w-[9.619rem] h-[0.7rem]">
            총 공부시간 78시간
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiFocusLineChart;
