import type { FunctionComponent } from 'react';
import { useMonthlyLineChart } from '../model/useMonthlyLineChart';

type Props = { userId: string };

const NUM_DAYS = 30;
const leftX = 2.354 * 16;
const topY = 2.0 * 16;
const chartW = 52.213 * 16;
const chartH = 16.125 * 16;
const maxHour = 12;
const stepX = chartW / (NUM_DAYS - 1);

function getHoursArr(arr: { date: string; minutes: number }[]) {
  const res: number[] = [];
  for (let i = 1; i <= NUM_DAYS; ++i) {
    const dayData = arr.find((a) => Number(a.date.split('-')[2]) === i);
    res.push(
      dayData
        ? Math.min(maxHour, Math.round((dayData.minutes / 60) * 10) / 10)
        : 0,
    );
  }
  return res;
}

const MonthlyLineChart: FunctionComponent<Props> = ({ userId }) => {
  const { thisMonth, lastMonth, loading } = useMonthlyLineChart(userId);

  if (loading) return <div>로딩 중...</div>;

  const thisHours = getHoursArr(thisMonth);
  const lastHours = getHoursArr(lastMonth);

  const yPx = (hour: number) => topY + chartH - (hour / maxHour) * chartH;
  const makePoints = (arr: number[]) =>
    arr.map((h, i) => `${leftX + i * stepX},${yPx(h)}`).join(' ');

  return (
    <div
      className="
        relative bg-white shadow-[6px_6px_54px_rgba(0,_0,_0,_0.05)]
        rounded-[25px] py-[3.125rem] px-[5.187rem] box-border
        w-[90vw] max-w-[1047px] h-[600px] min-w-[320px]
        text-left text-[0.875rem] text-darkgray font-poppins
        mx-auto
      "
    >
      {/* 범례 */}
      <div className="absolute top-[6.188rem] left-[13.125rem]">이번 달</div>
      <div className="absolute top-[6.188rem] left-[6.625rem] text-gray">
        지난 달
      </div>
      <div className="absolute top-[6.25rem] left-[11.688rem] rounded bg-deepskyblue w-[1rem] h-[1rem]" />
      <div className="absolute top-[6.25rem] left-[5.188rem] rounded bg-gainsboro w-[1rem] h-[1rem]" />

      {/* X/Y 축 라벨 */}
      <div className="absolute top-[9.5rem] left-[5.188rem] text-darkslategray">
        <div className="absolute top-[23.291rem] left-[2.913rem] flex flex-row gap-[6.437rem]">
          {[1, 5, 10, 15, 20, 25, 30].map((day) => (
            <div key={day}>{day}일</div>
          ))}
        </div>
        <div className="absolute left-0 flex flex-col gap-[1.875rem]">
          {[12, 10, 8, 6, 4, 2, 0].map((hour) => (
            <div key={hour}>{hour}</div>
          ))}
        </div>
      </div>

      {/* 이번달 라인 */}
      <svg
        className="absolute top-[2rem] left-[1.796rem]"
        width={53.269 * 16}
        height={16.125 * 16}
        style={{ pointerEvents: 'none' }}
      >
        <polyline
          fill="none"
          stroke="#0478ff"
          strokeWidth={4}
          points={makePoints(thisHours)}
          opacity={0.96}
        />
        {thisHours.map((h, i) =>
          h > 0 ? (
            <circle
              key={i}
              cx={leftX - (1.796 - 2.354) * 16 + i * stepX}
              cy={yPx(h) - topY}
              r={6}
              fill="#0478ff"
            />
          ) : null,
        )}
      </svg>

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
          points={makePoints(lastHours)}
          opacity={0.7}
        />
        {lastHours.map((h, i) =>
          h > 0 ? (
            <circle
              key={i}
              cx={i * stepX}
              cy={yPx(h) - 7.188 * 16}
              r={6}
              fill="#e3e3e4"
            />
          ) : null,
        )}
      </svg>
    </div>
  );
};

export default MonthlyLineChart;
