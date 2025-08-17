import type { FunctionComponent } from 'react';
import { useWeeklyBarChart } from '../model/useWeeklyBarChart';

type Props = { userId: string };

// 카드 높이 (600 → 550px으로 50px 감소)
const cardHeightPx = 550;

// 막대 최대 높이(px), y축 12시간 기준 (기존 328)
const maxBarHeightPx = 328;

// 막대 너비(rem 단위)
const barWidthRem = 3.5;

// 막대 위치 오프셋(rem 단위)
const barOffset = -7;

// X축 각 요일 라벨 left 위치(rem)
const barLefts = [11, 18, 25, 32, 39, 46, 53];

// 요일 라벨
const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];

// Y축 숫자 라벨(시간)과 각각의 세로 위치(rem 단위)
const yLabels = [0, 2, 4, 6, 8, 10, 12];
const yLabelTops = [26.813, 23.438, 20.063, 16.688, 13.313, 9.938, 6.563];

// Y축 점선 기준선 위치(rem 단위)
const dashedLineTops = [27.594, 24.156, 20.781, 17.406, 14.031, 10.656, 7.281];

const WeeklyBarChart: FunctionComponent<Props> = ({ userId }) => {
  const { weekdayGraph, error } = useWeeklyBarChart(userId);

  const hasData =
    Array.isArray(weekdayGraph) && weekdayGraph.some((v) => v > 0);

  const maxHours = hasData ? Math.max(...weekdayGraph, 12) : 12;

  // 모든 y축 부모 오프셋(rem 단위), 기존 3
  const yAxisOffset = 3;

  // 모든 점선 기준선 오프셋(rem 단위), 기존 3
  const verticalOffset = 3;

  // 카드 내부 위로 이동할 px 값 (카드 높이 감소와 동일하게 50px)
  const moveUpPx = 50;

  // ---- 바 그래프 그리기 ----

  const bars = (hasData ? weekdayGraph : Array(7).fill(0)).map((hours, idx) => {
    const height = Math.min(
      (hours / maxHours) * maxBarHeightPx,
      maxBarHeightPx,
    );

    return (
      <div
        key={idx}
        className={`
          absolute w-[3.5rem]
          rounded-t-[16px] transition-all shadow-lg
          bg-gradient-to-t from-[#38bdf8] via-[#60a5fa] to-[#6366f1]
          hover:brightness-105 hover:scale-105
        `}
        style={{
          left: `${barLefts[idx] + barOffset}rem`,
          bottom: `calc(6.6rem + ${moveUpPx}px - 45px)`,
          height: `${height}px`,
          transition:
            'height 0.6s cubic-bezier(0.4,0,0.2,1), filter 0.2s, transform 0.2s',
        }}
        title={`${dayLabels[idx]}: ${hours}시간`}
      />
    );
  });

  return (
    <div
      className={`
        w-full max-w-[1047px] bg-white rounded-[25px]
        shadow-[6px_6px_54px_rgba(0,0,0,0.05)]
        mx-auto box-border relative
        py-[3.125rem] px-[5.187rem]
        font-poppins text-left text-[0.875rem] text-darkgray
      `}
      style={{ minWidth: 320, height: `${cardHeightPx}px` }} // 수정: 동적 height는 style로 전달
    >
      {/* Y축 숫자 라벨 */}
      {yLabels.map((label, idx) => (
        <div
          key={label}
          className="absolute text-[1rem] text-darkslategray pointer-events-none select-none"
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

      {/* Y축 점선 기준선 */}
      {dashedLineTops.map((top, idx) => (
        <div
          key={idx}
          className="absolute border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem] z-0"
          style={{
            top: `calc(${top + verticalOffset}rem - ${moveUpPx}px)`,
            left: '2.8rem',
          }}
        />
      ))}

      {/* 바 그래프 */}
      {bars}

      {/* X축 요일 텍스트 */}
      {dayLabels.map((label, idx) => (
        <div
          key={label}
          className="absolute text-[1.25rem] font-inter text-black text-center"
          style={{
            top: `calc(33rem - ${moveUpPx}px)`,
            left: `calc(${barLefts[idx]}rem + ${barWidthRem / 2}rem - 2rem)`,
            width: '4rem',
            zIndex: 2,
            userSelect: 'none',
          }}
        >
          {label}
        </div>
      ))}

      {/* 데이터 없음 또는 에러 안내 */}
      {(!hasData || error) && (
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: `calc(${yLabelTops[3] + 0.1}rem - ${moveUpPx}px)`,
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
