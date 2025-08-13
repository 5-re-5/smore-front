import React from 'react';
interface StatPanelProps {
  bestFocusTime: { start: string; end: string };
  worstFocusTime: { start: string; end: string };
  averageFocusDuration: number;
}

const formatTimeRange = (start: string, end: string) => {
  const toText = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const period = h < 12 ? '오전' : '오후';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${period} ${hour}시${m ? ` ${m}분` : ''}`;
  };
  return `${toText(start)}~${toText(end)}`;
};

const formatDuration = (min: number) => {
  if (min <= 0) return '-';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}시간${m ? ` ${m}분` : ''}` : `${m}분`;
};

const StatPanel: React.FC<StatPanelProps> = ({
  bestFocusTime,
  worstFocusTime,
  averageFocusDuration,
}) => {
  return (
    <div
      className="relative w-full flex flex-row items-center justify-start gap-[1.562rem] text-center text-[1.625rem] text-darkslategray font-montserrat"
      style={{ height: 200 }}
    >
      {/* 카드 배경들 */}
      <div className="w-[23.75rem] relative shadow-[-10px_-10px_20px_#fff,_10px_10px_20px_rgba(0,_0,_0,_0.09)] rounded-[25px] bg-aliceblue h-[12.5rem] z-[0]" />
      <div className="w-[23.75rem] relative shadow-[-10px_-10px_20px_#fff,_10px_10px_20px_rgba(0,_0,_0,_0.09)] rounded-[25px] bg-aliceblue h-[12.5rem] z-[1]" />
      <div className="w-[23.75rem] relative shadow-[-10px_-10px_20px_#fff,_10px_10px_20px_rgba(0,_0,_0,_0.09)] rounded-[25px] bg-aliceblue h-[12.5rem] z-[2]" />

      {/* 타이틀 텍스트 */}
      <div className="w-[17.563rem] absolute !!m-[0 important] top-[3.063rem] left-[3.063rem] tracking-[0.01em] leading-[133.4%] font-semibold inline-block h-[2.169rem] z-[3]">
        최고 집중 시간대
      </div>
      <div className="w-[17.563rem] absolute !!m-[0 important] top-[3.063rem] left-[28.375rem] tracking-[0.01em] leading-[133.4%] font-semibold inline-block h-[2.169rem] z-[4]">
        최저 집중 시간대
      </div>
      <div className="w-[17.563rem] absolute !!m-[0 important] top-[3.063rem] left-[54.125rem] tracking-[0.01em] leading-[133.4%] font-semibold inline-block h-[2.169rem] z-[5]">
        평균 집중 유지 시간
      </div>

      {/* 값 텍스트 */}
      <div className="w-[19.063rem] absolute !!m-[0 important] top-[6.25rem] left-[2.313rem] text-[2.125rem] tracking-[0.01em] leading-[133.4%] font-semibold text-lightseagreen inline-block h-[5.625rem] z-[6]">
        {formatTimeRange(bestFocusTime.start, bestFocusTime.end)}
      </div>
      <div className="w-[19.063rem] absolute !!m-[0 important] top-[6.25rem] left-[27.625rem] text-[2.125rem] tracking-[0.01em] leading-[133.4%] font-semibold text-lightseagreen inline-block h-[4.788rem] z-[7]">
        {formatTimeRange(worstFocusTime.start, worstFocusTime.end)}
      </div>
      <div className="w-[18.875rem] absolute !!m-[0 important] top-[6.438rem] left-[53.5rem] text-[2.125rem] tracking-[0.01em] leading-[133.4%] font-semibold text-lightseagreen inline-block h-[5.125rem] z-[8]">
        {formatDuration(averageFocusDuration)}
      </div>
    </div>
  );
};

export default StatPanel;
