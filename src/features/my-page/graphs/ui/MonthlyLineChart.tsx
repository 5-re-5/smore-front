import type { FunctionComponent } from 'react';
import { useMonthlyLineChart } from '../model/useMonthlyLineChart';

type Props = { userId: string };

const NUM_DAYS = 30;
const leftX = 2.354 * 16;
const topY = 2 * 16;
const chartW = 52.213 * 16;
const chartH = 16.125 * 16;
const maxHour = 12;
const stepX = chartW / (NUM_DAYS - 1);

function getHoursArr(arr: { date: string; minutes: number }[]) {
  return Array.from({ length: NUM_DAYS }, (_, i) => {
    const day = i + 1;
    const data = arr.find((a) => Number(a.date.split('-')[2]) === day);
    return data
      ? Math.min(maxHour, Math.round((data.minutes / 60) * 10) / 10)
      : 0;
  });
}

const MonthlyLineChart: FunctionComponent<Props> = ({ userId }) => {
  const { monthTrack, loading, error } = useMonthlyLineChart(userId);

  // 데이터 존재 여부 판단 (시간 배열 중 0이 아닌 값이 하나라도 있으면 true)
  const hours = getHoursArr(monthTrack);
  const hasData = hours.some((hour) => hour > 0);

  const lastMonthHours = hours.map((h) => h * 0.85);
  const yPx = (hour: number) => topY + chartH - (hour / maxHour) * chartH;
  const makePoints = (arr: number[]) =>
    arr.map((h, i) => `${leftX + i * stepX},${yPx(h)}`).join(' ');

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white rounded-[25px] shadow min-h-[20rem]">
        로딩 중...
      </div>
    );
  }

  return (
    <div
      className="
        w-full max-w-[1047px] h-[600px] bg-white rounded-[25px]
        shadow-[6px_6px_54px_rgba(0,0,0,0.05)]
        mx-auto flex flex-col relative
        py-[3.125rem] px-[5.187rem] box-border
        font-poppins text-left text-[0.875rem] text-darkgray
      "
      style={{ minWidth: 320 }}
    >
      {/* 제목 */}
      <div className="absolute top-[3.125rem] left-[5.188rem] text-[1.25rem] font-medium text-black">
        월별 공부 시간 통계
      </div>

      {/* 범례 */}
      <div className="absolute top-[6.2rem] left-[5.188rem] flex flex-row items-center gap-[2.5rem] z-[20]">
        {/* 지난 달 */}
        <div className="flex flex-row items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded-sm" />
          <span className="text-gray font-semibold">지난 달</span>
        </div>
        {/* 이번 달 */}
        <div className="flex flex-row items-center gap-2">
          <div className="w-4 h-4 bg-sky-400 rounded-sm" />
          <span className="text-black font-semibold">이번 달</span>
        </div>
      </div>

      {/* X/Y 축 및 그래프 */}
      <div className="absolute top-[9.5rem] left-[5.188rem] w-full h-[24.875rem] text-[1rem] text-darkslategray">
        {/* X축 날짜 */}
        <div className="absolute top-[23.291rem] left-[2.913rem] w-[49.1rem] h-[1.581rem] flex flex-row items-center justify-start gap-[6.437rem]">
          {[1, 5, 10, 15, 20, 25, 30].map((day) => (
            <div key={day} className="relative whitespace-nowrap">
              {day}일
            </div>
          ))}
        </div>
        {/* Y축 시간 라벨 */}
        <div className="absolute top-[0rem] left-[0rem] w-[0.95rem] h-[22.963rem] flex flex-col items-center justify-start gap-[1.875rem]">
          {[12, 10, 8, 6, 4, 2, 0].map((hour) => (
            <div key={hour} className="self-stretch relative">
              {hour}
            </div>
          ))}
        </div>
        {/* Y축 기준선 */}
        <div className="absolute top-[0.792rem] left-[2.199rem] w-[52.369rem] h-[21.375rem] flex flex-col items-start justify-start gap-[3.375rem]">
          {[...Array(7).keys()].map((i) => (
            <div
              key={i}
              className="w-[52.813rem] relative border-lightgray border-dashed border-t-[1px] box-border h-[0.063rem]"
            />
          ))}
        </div>

        {/* 지난달 라인 */}
        <svg
          className="absolute top-[7.188rem] left-[2.354rem]"
          width={52.213 * 16}
          height={10.625 * 16}
          style={{ pointerEvents: 'none' }}
        >
          <polyline
            fill="none"
            stroke="#e3e3e4"
            strokeWidth={4}
            points={makePoints(lastMonthHours)}
            opacity={0.7}
          />
          {lastMonthHours.map((h, i) =>
            h > 0 ? (
              <circle
                key={i}
                cx={leftX - (1.796 - 2.354) * 16 + i * stepX}
                cy={yPx(h) - topY}
                r={6}
                fill="#e3e3e4"
              />
            ) : null,
          )}
        </svg>

        {/* 이번달 라인 */}
        <svg
          className="absolute top-[2rem] left-[1.796rem]"
          width={53.269 * 16}
          height={16.125 * 16}
          style={{ pointerEvents: 'none' }}
        >
          <polyline
            fill="none"
            stroke={error ? '#ccc' : '#0478ff'}
            strokeWidth={4}
            points={makePoints(hours)}
            opacity={error ? 0.5 : 0.96}
          />
          {hours.map((h, i) =>
            h > 0 ? (
              <circle
                key={i}
                cx={leftX - (1.796 - 2.354) * 16 + i * stepX}
                cy={yPx(h) - topY}
                r={6}
                fill={error ? '#ccc' : '#0478ff'}
              />
            ) : null,
          )}
        </svg>
      </div>

      {/* 데이터 없음 안내 버튼: 데이터 없거나 모두 0일 때 표시 */}
      {!hasData && !loading && (
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: '19rem' }} // 숫자 줄이면 위치 상승, 늘리면 하강
        >
          <div className="bg-[rgba(255,255,255,0.87)] px-6 py-2 rounded-xl font-semibold text-[1.13rem] pointer-events-none z-20 shadow-lg border border-gray-200 text-gray-700 text-center">
            데이터 없음
          </div>
        </div>
      )}

      {/* 에러 메시지 (별도 표시) */}
      {error && (
        <div className="absolute bottom-4 left-0 w-full text-center text-red-500 text-sm">
          에러 발생: {error} → 목데이터 표시 중
        </div>
      )}
    </div>
  );
};

export default MonthlyLineChart;
