import type { FunctionComponent } from 'react';
import { useWeeklyAvgBarChart } from '../model/useWeeklyAvgBarChart';

type Props = { userId: string };

const maxHours = 12;
const maxBarHeight = 320;
const leftRems = [16.125, 26.375, 35.563, 44.563, 54.188]; // 막대 시작(왼쪽)
const weekLabels = ['1주차', '2주차', '3주차', '4주차', '5주차'];

const yLabels = [0, 2, 4, 6, 8, 10, 12];
const yLabelTops = [27.188, 23.813, 20.438, 17.063, 13.688, 10.313, 6.938];

const WeeklyAvgBarChart: FunctionComponent<Props> = ({ userId }) => {
  const { weeklyGraph, loading, error } = useWeeklyAvgBarChart(userId);

  const hasData =
    Array.isArray(weeklyGraph) &&
    weeklyGraph.length === 5 &&
    weeklyGraph.some((v) => v > 0);

  // 막대 그래프는 데이터가 있을 때만 표시
  const bars = hasData
    ? weeklyGraph.map((hour, idx) => {
        const height = Math.max(24, (hour / maxHours) * maxBarHeight);
        return (
          <div
            key={idx}
            className="absolute w-[3.5rem] bg-[#34b3f1] rounded-t-[9px] shadow-[0_4px_12px_rgba(52,179,241,0.13)] transition-all"
            style={{
              left: `${leftRems[idx]}rem`,
              bottom: '4.5rem',
              height: `${height}px`,
              transition: 'height 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}
            title={`${idx + 1}주차: ${hour}시간`}
          />
        );
      })
    : [];

  return (
    <div
      className="
        w-full max-w-[1047px] h-[600px] bg-white rounded-[25px]
        shadow-[6px_6px_54px_rgba(0,0,0,0.05)]
        mx-auto box-border relative
        py-[3.125rem] px-[5.187rem]
        font-poppins text-left text-[1rem] text-darkgray
      "
      style={{ minWidth: 320 }}
    >
      {/* Y축 레이블 */}
      {yLabels.map((label, idx) => (
        <div
          key={label}
          className="absolute text-[1rem] text-darkslategray pointer-events-none select-none font-poppins"
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
      {[27.969, 24.531, 21.156, 17.781, 14.406, 11.031, 7.656].map(
        (top, idx) => (
          <div
            key={idx}
            className="absolute border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem] z-0"
            style={{ top: `${top}rem`, left: '2.8rem' }}
          />
        ),
      )}

      {/* 막대 그래프 (데이터가 있을 때만) */}
      <div className="absolute left-0 bottom-0 w-full h-[24.6rem]">{bars}</div>

      {/* X축 */}
      {weekLabels.map((label, idx) => (
        <div
          key={label}
          className="absolute text-[1.15rem] font-inter text-black text-center user-select-none leading-normal"
          style={{
            bottom: '3rem', // 위치 상승: 값 감소 , 하강: 값 상승
            left: `calc(${leftRems[idx]}rem - 5rem)`, // 더 오른쪽에 두려면 +값/왼쪽이면 -값
            width: '5.5rem', // 막대보다 더 넓게
            zIndex: 10,
            letterSpacing: '-1px',
          }}
        >
          {label}
        </div>
      ))}

      {/* 데이터 없음/에러 버튼 */}
      {(!hasData || error) && (
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: '17rem' }} // 숫자 줄이면 위치 상승, 늘리면 하강
        >
          <div className="bg-[rgba(255,255,255,0.87)] px-6 py-2 rounded-xl font-semibold text-[1.13rem] pointer-events-none z-20 shadow-lg border border-gray-200 text-gray-700 text-center">
            {error ? `에러: ${error}` : '데이터 없음'}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyAvgBarChart;
