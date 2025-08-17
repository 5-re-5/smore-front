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

// 공통 스타일 헬퍼 컴포넌트 (타이틀 텍스트)
const StatLabel = ({
  style,
  children,
  z,
}: {
  style?: React.CSSProperties;
  children: React.ReactNode;
  z: number;
}) => (
  <div
    className="w-[17.563rem] absolute !m-0 tracking-[0.01em] leading-[133.4%] font-semibold inline-block h-[2.169rem]"
    style={style ? { ...style, zIndex: z } : { zIndex: z }}
  >
    {children}
  </div>
);

// 값 표시용 헬퍼 컴포넌트
const StatValue = ({
  style,
  children,
  z,
  height,
  left,
  className = '',
}: {
  style?: React.CSSProperties;
  children: React.ReactNode;
  z: number;
  height: string;
  left: string;
  className?: string;
}) => (
  <div
    className={`w-[19.063rem] absolute !m-0 text-[2.125rem] tracking-[0.01em] leading-[133.4%] font-semibold text-[#29BDBC] inline-block ${className}`}
    style={{
      top: left === '53.5rem' ? '6.438rem' : '6.25rem',
      left,
      height,
      zIndex: z,
      ...style,
    }}
  >
    {children}
  </div>
);

const StatPanel: React.FC<StatPanelProps> = ({
  bestFocusTime,
  worstFocusTime,
  averageFocusDuration,
}) => {
  return (
    <div
      className="relative w-full flex flex-row items-center justify-start gap-[1.562rem] text-center text-[1.625rem] text-[#2F4F4F] font-montserrat"
      style={{ height: 200 }}
    >
      {/* 카드 배경들 */}
      <div className="w-[23.75rem] relative shadow-[-10px_-10px_20px_#fff,_10px_10px_20px_rgba(0,0,0,0.09)] rounded-[25px] bg-aliceblue h-[12.5rem] z-[0]" />
      <div className="w-[23.75rem] relative shadow-[-10px_-10px_20px_#fff,_10px_10px_20px_rgba(0,0,0,0.09)] rounded-[25px] bg-aliceblue h-[12.5rem] z-[1]" />
      <div className="w-[23.75rem] relative shadow-[-10px_-10px_20px_#fff,_10px_10px_20px_rgba(0,0,0,0.09)] rounded-[25px] bg-aliceblue h-[12.5rem] z-" />

      {/* 타이틀 텍스트 */}
      <StatLabel style={{ top: '3.063rem', left: '3.063rem' }} z={3}>
        최고 집중 시간대
      </StatLabel>
      <StatLabel style={{ top: '3.063rem', left: '28.375rem' }} z={4}>
        최저 집중 시간대
      </StatLabel>
      <StatLabel style={{ top: '3.063rem', left: '54.125rem' }} z={5}>
        평균 집중 유지 시간
      </StatLabel>

      {/* 값 텍스트  */}
      <StatValue left="2.313rem" height="5.625rem" z={6}>
        {formatTimeRange(bestFocusTime.start, bestFocusTime.end)}
      </StatValue>
      <StatValue left="27.625rem" height="4.788rem" z={7}>
        {formatTimeRange(worstFocusTime.start, worstFocusTime.end)}
      </StatValue>
      <StatValue
        left="53.5rem"
        height="5.125rem"
        z={8}
        className="w-[18.875rem]"
      >
        {formatDuration(averageFocusDuration)}
      </StatValue>
    </div>
  );
};

export default StatPanel;
