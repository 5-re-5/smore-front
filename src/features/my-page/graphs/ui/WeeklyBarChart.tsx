import type { FunctionComponent } from 'react';
import { useWeeklyBarChart } from '../model/useWeeklyBarChart';

type Props = { userId: string };

// 최대 막대 높이(px), y축 12시간에 해당하는 높이 기준
const maxBarHeightPx = 328;

// 막대 너비(rem 단위)
const barWidthRem = 3.5;

// 막대 위치 오프셋(rem 단위) - 이 값을 조절하면 모든 막대가 동일하게 이동
const barOffset = -7;

// X축 텍스트 좌우 위치 조절
const barLefts = [11, 18, 25, 32, 39, 46, 53];

// 요일 라벨
const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];

// Y축 숫자 라벨(시간)과 각각의 세로 위치(rem 단위)
const yLabels = [0, 2, 4, 6, 8, 10, 12];
const yLabelTops = [26.813, 23.438, 20.063, 16.688, 13.313, 9.938, 6.563];

const WeeklyBarChart: FunctionComponent<Props> = ({ userId }) => {
  const { weekdayGraph, error } = useWeeklyBarChart(userId);

  // 데이터 유무 확인
  const hasData =
    Array.isArray(weekdayGraph) && weekdayGraph.some((v) => v > 0);

  // 최대 공부 시간 (API 최대값 또는 12시간 중 큰 값), 기본 12시간
  const maxHours = hasData ? Math.max(...weekdayGraph, 12) : 12;

  // Y축 숫자 라벨 전체 상하 이동 오프셋(rem 단위, 음수면 위로 이동)
  const yAxisOffset = 3;

  // Y축 점선 전체 상하 이동 오프셋(rem 단위)
  const verticalOffset = 3;

  //---- 막대 그래프 그리기 ----

  // 막대 그래프 리스트, 데이터 없으면 0으로 채움
  const bars = (hasData ? weekdayGraph : Array(7).fill(0)).map((hours, idx) => {
    // 막대 높이 계산 (공부 시간 비율 * 최대 높이), 최대 높이 제한
    const height = Math.min(
      (hours / maxHours) * maxBarHeightPx,
      maxBarHeightPx,
    );

    return (
      <div
        key={idx}
        className="absolute w-[3.5rem] bg-[#34b3f1] rounded-t-[5px] transition-all"
        style={{
          left: `${barLefts[idx] + barOffset}rem`, // 기존 위치 + 오프셋 (barOffset 값을 조절하면 모든 막대 위치 변경)
          bottom: '6.6rem', // 막대 바닥으로부터 세로 위치, 막대 전체 상하 이동 조절 포인트
          height: `${height}px`, // 막대 높이
          transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)', // 높이 변경 애니메이션
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
      {/* Y축 숫자 라벨 출력 */}
      {yLabels.map((label, idx) => (
        <div
          key={label}
          className="absolute text-[1rem] text-darkslategray pointer-events-none select-none"
          style={{
            top: `${yLabelTops[idx] + yAxisOffset}rem`, // 전체 오프셋 포함 수직 위치
            left: '0.7rem', // Y축 숫자 가로 위치 조절
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
            style={{
              top: `${top + verticalOffset}rem`, // 전체 오프셋 포함 점선 세로 위치
              left: '2.8rem', // 점선 가로 위치
            }}
          />
        ),
      )}

      {/* 막대 그래프 렌더링 */}
      {bars}

      {/* X축 요일 텍스트: barLefts 기반 중앙 위치 계산 + 미세 조정 */}
      {dayLabels.map((label, idx) => (
        <div
          key={label}
          className="absolute text-[1.25rem] font-inter text-black text-center"
          style={{
            top: '33rem', // X축 텍스트 수직 위치 조절
            left: `calc(${barLefts[idx]}rem + ${barWidthRem / 2}rem - 2rem)`, // 막대 중앙 기준 위치 + 미세 조정 (-2rem)
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
            top: `${yLabelTops[3] + 0.1}rem`, // 메시지 위치 조정 가능
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
