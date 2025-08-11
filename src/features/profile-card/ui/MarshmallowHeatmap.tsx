// MarshmallowHeatmap.tsx
import type { FC } from 'react';

type Level = 0 | 1 | 2 | 3 | 4;
export type ContributionData = Record<string, Level>;

type MarshmallowHeatmapProps = {
  /** 주(열) x 요일(행) 2D 데이터 (선택) */
  data?: number[][];
  /** 날짜 키 맵(YYYY-MM-DD -> 0..4) (선택) */
  dataByDate?: ContributionData;
  /** 오른쪽 끝 날짜 (기본: 오늘) */
  endDate?: string | Date;
};

const CELL = 14.369; // 각 잔디 크기(px)
const GAP = 4; // 셀 간격(px)
const PALETTE = ['#eee6da', '#f9ccb4', '#f9a57b', '#d67739', '#7e4420']; // 0..4

// ----- date utils -----
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const startOfWeekSunday = (d: Date) => {
  const x = new Date(d);
  const day = x.getDay(); // 0..6 (Sun=0)
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
};
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const addWeeks = (d: Date, n: number) => addDays(d, n * 7);

// 월/요일 라벨
const MONTH_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const MONTH_SHORT = [
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
]; // GitHub 예시처럼 영어 약어
const DAY_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getRandom = () => Math.floor(Math.random() * 5) as Level;

const MarshmallowHeatmap: FC<MarshmallowHeatmapProps> = ({
  data,
  dataByDate,
  endDate = new Date(),
}) => {
  // === 지난 1년치(53주) 컬럼 계산 ===
  const end = new Date(endDate);
  const lastSunday = startOfWeekSunday(end); // 오른쪽 끝 주의 일요일
  const firstSunday = addWeeks(lastSunday, -52); // 52주 전 일요일 (총 53주)
  const columns = Array.from({ length: 53 }, (_, i) =>
    addWeeks(firstSunday, i),
  );

  // 7일(행) x 53주(열) 값
  const grid: Level[][] = columns.map((colStart, xi) =>
    Array.from({ length: 7 }, (_, yi) => {
      const cellDate = addDays(colStart, yi);
      const key = toISO(cellDate);
      if (cellDate > end) return 0; // 미래는 0

      if (dataByDate && key in dataByDate) return dataByDate[key]!;
      if (data?.[xi]?.[yi] !== undefined) {
        const raw = data[xi][yi]!;
        return (raw < 0 ? 0 : raw > 4 ? 4 : raw) as Level;
      }
      return getRandom();
    }),
  );

  // 월 헤더 세그먼트 계산 (GitHub 로직 유사: 달이 바뀌고 그 주가 해당 달 첫 7일 구간이면 레이블 시작)
  type MonthSeg = { idx: number; full: string; short: string };
  const segs: MonthSeg[] = [];
  for (let i = 0; i < columns.length; i++) {
    const d = columns[i];
    const prev = i > 0 ? columns[i - 1] : null;
    const changed = !prev || d.getMonth() !== prev.getMonth();
    if (changed && d.getDate() <= 7) {
      segs.push({
        idx: i,
        full: MONTH_FULL[d.getMonth()],
        short: MONTH_SHORT[d.getMonth()] ?? MONTH_SHORT[d.getMonth()],
      });
    }
  }
  const headerCells = segs.map((s, i) => ({
    ...s,
    span: (i < segs.length - 1 ? segs[i + 1].idx : columns.length) - s.idx,
  }));

  // 요일 라벨은 월/수/금만 노출
  const showWeekdayLabel = (dayIdx: number) =>
    dayIdx === 1 || dayIdx === 3 || dayIdx === 5;

  return (
    <div className="w-full py-3 flex flex-col items-start">
      <table
        role="grid"
        aria-readonly="true"
        className="ContributionCalendar-grid js-calendar-graph-table"
        style={{
          borderSpacing: `${GAP}px`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <caption className="sr-only">Contribution Graph</caption>

        {/* 월 헤더 */}
        <thead>
          <tr style={{ height: 13 }}>
            <td style={{ width: 28 }}>
              <span className="sr-only">Day of Week</span>
            </td>
            {headerCells.map((h, i) => (
              <td
                key={i}
                className="ContributionCalendar-label relative"
                colSpan={h.span}
                style={{ position: 'relative' }}
              >
                <span className="sr-only">{h.full}</span>
                <span aria-hidden="true" className="absolute top-0">
                  {h.short}
                </span>
              </td>
            ))}
          </tr>
        </thead>

        {/* 본문(요일 x 주) */}
        <tbody>
          {DAY_SHORT.map((dShort, rowIdx) => (
            <tr key={dShort}>
              {/* 요일 라벨 셀 */}
              <td
                className="ContributionCalendar-label relative"
                style={{ position: 'relative', width: 28 }}
              >
                <span className="sr-only">{DAY_FULL[rowIdx]}</span>
                <span
                  aria-hidden="true"
                  style={{
                    clipPath: showWeekdayLabel(rowIdx) ? 'none' : 'circle(0)',
                    position: 'absolute',
                    bottom: -3,
                  }}
                >
                  {dShort}
                </span>
              </td>

              {/* 주(열)들 */}
              {columns.map((colStart, colIdx) => {
                const date = addDays(colStart, rowIdx);
                const key = toISO(date);
                const lvl = grid[colIdx][rowIdx];
                const tabbable = colIdx === 0 && rowIdx === 0 ? 0 : -1;

                return (
                  <td
                    key={`${rowIdx}-${colIdx}`}
                    tabIndex={tabbable}
                    role="gridcell"
                    data-date={key}
                    data-level={lvl}
                    aria-selected={false}
                    aria-describedby={`contribution-graph-legend-level-${lvl}`}
                    className="ContributionCalendar-day rounded-[4px]"
                    title={`${key}: level ${lvl}`}
                    style={{
                      width: CELL,
                      height: CELL,
                      background: PALETTE[lvl],
                      transition: 'background 0.15s',
                    }}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 강도 범례 */}
      <div className="flex items-center gap-2 text-sm mt-3">
        <span>Less</span>
        {PALETTE.map((c, i) => (
          <span
            key={i}
            className="inline-block rounded-[4px]"
            style={{ width: CELL, height: CELL, background: c }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default MarshmallowHeatmap;
