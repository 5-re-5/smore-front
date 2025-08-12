// MarshmallowHeatmap.tsx
import React, { useEffect, useRef, useState, type FC } from 'react';

type Level = 0 | 1 | 2 | 3 | 4;
export type ContributionData = Record<string, Level>;

type MarshmallowHeatmapProps = {
  data?: number[][];
  dataByDate?: ContributionData;
  endDate?: string | Date;
};

// ---- base (상한) 값 ----
const BASE_CELL = 14.369; // 최대 셀 크기
const GAP = 4; // 컬럼/행 간격
const LABEL_W = 28; // 좌측 요일 라벨 폭
const QUARTER_EXTRA_FACTOR = 8; // 분기 여백 = GAP * 8
const PALETTE = ['#eee6da', '#f9ccb4', '#f9a57b', '#d67739', '#7e4420'];

// ----- date utils -----
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const startOfWeekSunday = (d: Date) => {
  const x = new Date(d);
  const day = x.getDay();
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

// 라벨
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
];
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

// 분기 시작 여부
const isQuarterStartWeek = (columns: Date[], colIdx: number) => {
  if (colIdx <= 0) return false;
  const cur = columns[colIdx];
  const prev = columns[colIdx - 1];
  const monthChanged = cur.getMonth() !== prev.getMonth();
  const quarterMonths = [0, 3, 6, 9]; // Jan, Apr, Jul, Oct
  return (
    monthChanged && quarterMonths.includes(cur.getMonth()) && cur.getDate() <= 7
  );
};

type MonthSeg = { idx: number; full: string; short: string };
const getRandom = () => Math.floor(Math.random() * 5) as Level;

const MarshmallowHeatmap: FC<MarshmallowHeatmapProps> = ({
  data,
  dataByDate,
  endDate = new Date(),
}) => {
  // 전체 래퍼(가용 폭 측정용)
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cell, setCell] = useState(BASE_CELL);

  // === 지난 1년치(53주) 컬럼 계산 ===
  const end = new Date(endDate);
  const lastSunday = startOfWeekSunday(end);
  const firstSunday = addWeeks(lastSunday, -52);
  const weeks = Array.from({ length: 53 }, (_, i) => addWeeks(firstSunday, i));

  // 그리드 데이터
  const grid: Level[][] = weeks.map((colStart, xi) =>
    Array.from({ length: 7 }, (_, yi) => {
      const cellDate = addDays(colStart, yi);
      const key = toISO(cellDate);
      if (cellDate > end) return 0;
      if (dataByDate && key in dataByDate) return dataByDate[key]!;
      if (data?.[xi]?.[yi] !== undefined) {
        const raw = data[xi][yi]!;
        return (raw < 0 ? 0 : raw > 4 ? 4 : raw) as Level;
      }
      return getRandom();
    }),
  );

  // ----- 시각적 컬럼 구성: spacer(분기 경계 여백) + week -----
  type VisualCol = { kind: 'spacer' } | { kind: 'week'; colIdx: number };
  const visualCols: VisualCol[] = [];
  for (let i = 0; i < weeks.length; i++) {
    if (isQuarterStartWeek(weeks, i)) visualCols.push({ kind: 'spacer' });
    visualCols.push({ kind: 'week', colIdx: i });
  }
  const spacerCount = visualCols.filter((v) => v.kind === 'spacer').length;
  const totalCols = visualCols.length;

  // 가용 폭에 맞춰 셀 크기 동적 조정
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const recompute = () => {
      const quarterExtra = GAP * QUARTER_EXTRA_FACTOR; // px
      const available = Math.max(0, el.clientWidth - LABEL_W); // 오른쪽 그리드에 할당 가능한 폭
      const baseNeed =
        weeks.length * BASE_CELL +
        spacerCount * quarterExtra +
        (totalCols - 1) * GAP;

      if (available >= baseNeed) {
        setCell(BASE_CELL);
      } else {
        const newCell =
          (available - spacerCount * quarterExtra - (totalCols - 1) * GAP) /
          weeks.length;
        // 너무 작아지면 읽기 어려우니 하한선(8px) 부여
        setCell(Math.max(8, Math.round(newCell * 1000) / 1000));
      }
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [weeks.length, spacerCount, totalCols]);

  // 월 세그먼트
  const monthSegs: MonthSeg[] = [];
  for (let i = 0; i < weeks.length; i++) {
    const d = weeks[i];
    const prev = i > 0 ? weeks[i - 1] : null;
    const changed = !prev || d.getMonth() !== prev.getMonth();
    if (changed && d.getDate() <= 7) {
      monthSegs.push({
        idx: i,
        full: MONTH_FULL[d.getMonth()],
        short: MONTH_SHORT[d.getMonth()] ?? MONTH_SHORT[d.getMonth()],
      });
    }
  }
  const monthSegsWithSpan = monthSegs.map((s, i) => {
    const nextWeekIdx =
      i < monthSegs.length - 1 ? monthSegs[i + 1].idx : weeks.length;
    return { ...s, weekSpan: nextWeekIdx - s.idx };
  });

  // week 인덱스 -> visual 인덱스
  const weekIdxToVisualIdx = (weekIdx: number) => {
    for (let i = 0; i < visualCols.length; i++) {
      const vc = visualCols[i];
      if (vc.kind === 'week' && vc.colIdx === weekIdx) return i;
    }
    return 0;
  };

  // 헤더/본문 공통: grid-template-columns
  const quarterExtraGap = GAP * QUARTER_EXTRA_FACTOR; // px
  const gridTemplateColumns = visualCols
    .map((vc) => (vc.kind === 'spacer' ? `${quarterExtraGap}px` : `${cell}px`))
    .join(' ');

  const showWeekdayLabel = (dayIdx: number) =>
    dayIdx === 1 || dayIdx === 3 || dayIdx === 5;

  return (
    <div
      ref={wrapRef}
      className="w-full py-3 flex flex-col items-start overflow-hidden"
    >
      {/* 월 헤더 */}
      <div className="flex items-start">
        <div style={{ width: LABEL_W, height: 13 }} aria-hidden="true" />
        <div
          className="relative grid text-xs"
          style={{ gridTemplateColumns, columnGap: GAP }}
          aria-hidden="true"
        >
          {monthSegsWithSpan.map((seg, i) => {
            const startV = weekIdxToVisualIdx(seg.idx);
            const endWeekIdx = seg.idx + seg.weekSpan; // exclusive
            const endV =
              endWeekIdx >= weeks.length
                ? visualCols.length
                : weekIdxToVisualIdx(endWeekIdx);
            return (
              <div
                key={i}
                className="ContributionCalendar-label relative"
                style={{
                  gridColumn: `${startV + 1} / ${endV + 1}`,
                  height: 13,
                }}
              >
                <span className="sr-only">{seg.full}</span>
                <span aria-hidden="true" className="absolute top-0">
                  {seg.short}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 본문 (요일 x 주) */}
      <div className="flex items-start mt-1">
        {/* 요일 라벨 */}
        <div
          className="relative text-xs"
          style={{
            width: LABEL_W,
            display: 'grid',
            gridTemplateRows: `repeat(7, ${cell}px)`,
            rowGap: GAP,
            height: cell * 7 + GAP * 6,
          }}
        >
          {DAY_SHORT.map((dShort, rowIdx) => (
            <div key={dShort} className="relative" style={{ height: cell }}>
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
            </div>
          ))}
        </div>

        {/* 그리드 */}
        <div
          role="grid"
          aria-readonly="true"
          className="grid"
          style={{
            gridTemplateColumns,
            gridTemplateRows: `repeat(7, ${cell}px)`,
            columnGap: GAP,
            rowGap: GAP,
          }}
        >
          {visualCols.map((vc, vColIdx) => {
            if (vc.kind === 'spacer') {
              return (
                <div
                  key={`sp-${vColIdx}`}
                  aria-hidden="true"
                  style={{
                    gridColumn: vColIdx + 1,
                    gridRow: `1 / span 7`,
                    width: quarterExtraGap,
                  }}
                />
              );
            }

            const { colIdx } = vc;
            return (
              <React.Fragment key={`wk-${vColIdx}-${colIdx}`}>
                {Array.from({ length: 7 }, (_, rowIdx) => {
                  const date = addDays(weeks[colIdx], rowIdx);
                  const key = toISO(date);
                  const lvl = grid[colIdx][rowIdx];
                  return (
                    <div
                      key={`${vColIdx}-${rowIdx}`}
                      role="gridcell"
                      data-date={key}
                      data-level={lvl}
                      aria-selected={false}
                      aria-describedby={`contribution-graph-legend-level-${lvl}`}
                      title={`${key}: level ${lvl}`}
                      className="rounded-[4px]"
                      style={{
                        gridColumn: vColIdx + 1,
                        gridRow: rowIdx + 1,
                        width: cell,
                        height: cell,
                        background: PALETTE[lvl],
                        transition: 'background 0.15s',
                      }}
                    />
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 범례 */}
      <div className="flex items-center gap-2 text-sm mt-3">
        <span>Less</span>
        {PALETTE.map((c, i) => (
          <span
            key={i}
            className="inline-block rounded-[4px]"
            style={{ width: cell, height: cell, background: c }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default MarshmallowHeatmap;
