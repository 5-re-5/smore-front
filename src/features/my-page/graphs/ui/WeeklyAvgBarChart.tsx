import type { FunctionComponent } from 'react';
import { useWeeklyAvgBarChart } from '../model/useWeeklyAvgBarChart';

type Props = { userId: string };

const maxHours = 12;
const maxBarHeight = 320;
const leftRems = [10, 20, 30, 40, 50];
const weekLabels = ['1주차', '2주차', '3주차', '4주차', '5주차'];

const yLabels = [0, 2, 4, 6, 8, 10, 12];
const yLabelTops = [27.188, 23.813, 20.438, 17.063, 13.688, 10.313, 6.938];
const dashedLineTops = [27.969, 24.531, 21.156, 17.781, 14.406, 11.031, 7.656];

const WeeklyAvgBarChart: FunctionComponent<Props> = ({ userId }) => {
  const { weeklyGraph, error } = useWeeklyAvgBarChart(userId);

  const hasData =
    Array.isArray(weeklyGraph) &&
    weeklyGraph.length === 5 &&
    weeklyGraph.some((v) => v > 0);

  const moveUpPx = 50;

  const verticalOffset = 3;
  const yAxisOffset = 3;

  // 막대 그래프
  const bars = hasData
    ? weeklyGraph.map((hour, idx) => {
        const height = Math.min(hour * (maxBarHeight / maxHours), maxBarHeight);
        return (
          <div
            key={idx}
            className={`
              absolute
              w-[3.5rem]
              rounded-t-[16px]
              transition-all
              shadow-lg
              bg-gradient-to-t from-[#38bdf8] via-[#60a5fa] to-[#6366f1]
              hover:brightness-105
              hover:scale-105
            `}
            style={{
              left: `${leftRems[idx]}rem`,
              bottom: '6.6rem', // 막대 그래프는 카드 아래 기준, 변경 없이 유지
              height: `${height}px`,
              transition:
                'height 0.6s cubic-bezier(0.4,0,0.2,1), filter 0.2s, transform 0.2s',
            }}
            title={`${idx + 1}주차: ${hour}시간`}
          />
        );
      })
    : [];

  return (
    <div
      className="
        w-full max-w-[1047px] h-[550px] bg-white rounded-[25px]
        shadow-[6px_6px_54px_rgba(0,0,0,0.05)]
        mx-auto box-border relative
        py-[3.125rem] px-[5.187rem]
        font-poppins text-left text-[1rem] text-darkgray
      "
      style={{ minWidth: 320 }}
    >
      {/* Y축 시간 */}
      {yLabels.map((label, idx) => (
        <div
          key={label}
          className="absolute text-[1rem] text-darkslategray pointer-events-none select-none font-poppins"
          style={{
            top: `calc(${yLabelTops[idx] + yAxisOffset}rem - ${moveUpPx}px)`,
            left: '0.7rem',
            width: '2.8rem',
            textAlign: 'right',
            zIndex: 2,
          }}
        >
          {label}
        </div>
      ))}

      {/* Y축 점선 */}
      {dashedLineTops.map((top, idx) => (
        <div
          key={idx}
          className="absolute border-lightgray border-dashed border-t-[1px]
                 box-border w-[52.813rem] h-[0.063rem] z-0"
          style={{
            top: `calc(${top + verticalOffset}rem - ${moveUpPx}px)`,
            left: '6.5rem',
          }}
        />
      ))}

      {/* 막대 그래프 */}
      <div className="absolute left-0 bottom-0 w-full h-[24.6rem]">{bars}</div>

      {/* X축 레이블 */}
      {weekLabels.map((label, idx) => (
        <div
          key={label}
          className="absolute text-[1.15rem] font-inter text-black text-center
               user-select-none leading-normal"
          style={{
            bottom: '3.5rem',
            left: `calc(${leftRems[idx]}rem - 1rem)`,
            width: '5.5rem',
            zIndex: 10,
            letterSpacing: '-1px',
          }}
        >
          {label}
        </div>
      ))}

      {/* 데이터 없음 / 에러 메시지 */}
      {(!hasData || error) && (
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: `calc(17rem - ${moveUpPx}px)` }}
        >
          <div
            className="bg-[rgba(255,255,255,0.87)] px-6 py-2 rounded-xl
                   font-semibold text-[1.13rem] pointer-events-none
                   z-20 shadow-lg border border-gray-200 text-gray-700
                   text-center"
          >
            {error ? `에러: ${error}` : '데이터 없음'}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyAvgBarChart;
