// src/features/my-page/graphs/ui/WeeklyBarChart.tsx
import type { FunctionComponent } from 'react';
import { useWeeklyBarChart } from '../model/useWeeklyBarChart';

type Props = { userId: string };

const maxBarHeightPx = 328;
const barWidthRem = 3.5;
const barLefts = [10, 18, 25, 33, 41, 48.5, 56]; // 월~일
const barCenters = barLefts.map((l) => l + barWidthRem / 2);
const barTops = Array(7).fill(11.3);
const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];
const yLabels = [0, 2, 4, 6, 8, 10, 12];
const yLabelTops = [26.813, 23.438, 20.063, 16.688, 13.313, 9.938, 6.563];

const WeeklyBarChart: FunctionComponent<Props> = ({ userId }) => {
  const { weekdayGraph, error } = useWeeklyBarChart(userId);

  const hasData =
    Array.isArray(weekdayGraph) && weekdayGraph.some((v) => v > 0);
  const maxHours = hasData ? Math.max(...weekdayGraph, 12) : 12;

  // 막대 그래프 DOM (데이터 없으면 0)
  const bars = (hasData ? weekdayGraph : Array(7).fill(0)).map((hours, idx) => {
    const height = (hours / maxHours) * maxBarHeightPx;
    return (
      <div
        key={idx}
        className="absolute w-[3.5rem] bg-[#34b3f1] rounded-t-[5px] transition-all"
        style={{
          left: `${barLefts[idx]}rem`,
          top: `${barTops[idx]}rem`,
          height: `${height}px`,
          transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}
        title={`${dayLabels[idx]}: ${hours}시간`}
      />
    );
  });

  return (
    <div
      className={`
        w-full max-w-[1047px] h-[600px] bg-white rounded-[25px]
        shadow-[6px_6px_54px_rgba(0,0,0,0.05)]
        mx-auto box-border relative
        py-[3.125rem] px-[5.187rem]
        font-poppins text-left text-[0.875rem] text-darkgray
      `}
      style={{ minWidth: 320 }}
    >
      {/* Y축 숫자 라벨 */}
      {yLabels.map((label, idx) => (
        <div
          key={label}
          className="absolute text-[1rem] text-darkslategray pointer-events-none select-none"
          style={{
            top: `${yLabelTops[idx]}rem`,
            left: '0.7rem',
            width: '2.8rem',
            textAlign: 'right',
            zIndex: 2,
          }}
        >
          {label}
        </div>
      ))}
      {/* Y축 점선 기준선 */}
      {[27.594, 24.156, 20.781, 17.406, 14.031, 10.656, 7.281].map(
        (top, idx) => (
          <div
            key={idx}
            className="absolute border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem] z-0"
            style={{ top: `${top}rem`, left: '2.8rem' }}
          />
        ),
      )}
      {/* 막대 그래프 */}
      {bars}
      {/* X축 */}
      {dayLabels.map((label, idx) => (
        <div
          key={label}
          className="absolute text-[1.25rem] font-inter text-black text-center"
          style={{
            top: '31rem', // 상하 위치 조절. 숫자 줄이면 상승
            left: `calc(${barCenters[idx]}rem - 3.5rem)`, // 좌우 위치 조절. 줄이면 오른쪽 늘리면 왼쪽
            width: '4rem',
            zIndex: 2,
            userSelect: 'none',
          }}
        >
          {label}
        </div>
      ))}
      {/* 데이터 없음 or 에러 안내 버튼 */}
      {(!hasData || error) && (
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: `${yLabelTops[3] + 0.1}rem`, //값 줄이면 버튼 상승, 늘리면 하강
          }}
        >
          <div className="text-gray bg-[rgba(255,255,255,0.87)] px-6 py-2 rounded-xl font-semibold text-[1.13rem] pointer-events-none z-20 shadow-lg border border-gray-200">
            {error ? `에러: ${error}` : '데이터 없음'}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyBarChart;
