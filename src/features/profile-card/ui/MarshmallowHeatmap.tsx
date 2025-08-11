// MarshmallowHeatmap.tsx
import type { FC } from 'react';
// MarshmallowHeatmap.tsx
import React from 'react';

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
const QUARTER_EXTRA_GAP = GAP * 8; // 분기 경계에서 추가 여백
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
// GitHub 순서(오른쪽 끝이 오늘, 1년치): Aug ~ Jul
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

// 분기 시작 여부 (Jan/Apr/Jul/Oct 시작 주이고, 그 주의 시작일이 그 달 7일 이내)
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

// 월 헤더 세그먼트 (달이 바뀌고 그 주가 해당 달 첫 7일이면 표시)
type MonthSeg = { idx: number; full: string; short: string };

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
  const weeks = Array.from({ length: 53 }, (_, i) => addWeeks(firstSunday, i)); // 각 주(열)의 시작일(일요일)

  // 7일(행) x 53주(열) 값
  const grid: Level[][] = weeks.map((colStart, xi) =>
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

  // ----- 시각적 컬럼 구성: spacer(분기 경계 여백) + week -----
  type VisualCol = { kind: 'spacer' } | { kind: 'week'; colIdx: number };

  const visualCols: VisualCol[] = [];
  for (let i = 0; i < weeks.length; i++) {
    if (isQuarterStartWeek(weeks, i)) {
      visualCols.push({ kind: 'spacer' });
    }
    visualCols.push({ kind: 'week', colIdx: i });
  }

  // 헤더용 월 세그먼트 계산 (week 기준)
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

  // "week 인덱스"를 "visual 인덱스"로 변환 (spacer 포함)
  const weekIdxToVisualIdx = (weekIdx: number) => {
    let v = 0;
    for (let i = 0; i < visualCols.length; i++) {
      const vc = visualCols[i];
      if (vc.kind === 'week' && vc.colIdx === weekIdx) {
        v = i;
        break;
      }
    }
    return v;
  };

  // 헤더를 위한 visual grid column 정의
  // spacer는 고정 폭(QUARTER_EXTRA_GAP), week는 CELL 폭
  const gridTemplateColumns = visualCols
    .map((vc) =>
      vc.kind === 'spacer' ? `${QUARTER_EXTRA_GAP}px` : `${CELL}px`,
    )
    .join(' ');

  // 요일 라벨은 월/수/금만 노출
  const showWeekdayLabel = (dayIdx: number) =>
    dayIdx === 1 || dayIdx === 3 || dayIdx === 5;

  return (
    <div className="w-full py-3 flex flex-col items-start">
      {/* 월 헤더 (visual grid에 정렬) */}
      <div className="flex items-start">
        {/* 요일 라벨 컬럼 자리 맞춤용 빈 공간 (헤더 라인에서 요일 텍스트 대신 폭만 확보) */}
        <div style={{ width: 28, height: 13 }} aria-hidden="true" />
        <div
          className="relative grid text-xs"
          style={{
            gridTemplateColumns,
            columnGap: GAP,
          }}
          aria-hidden="true"
        >
          {/* 각 월 세그먼트 라벨을 grid line으로 배치 */}
          {monthSegsWithSpan.map((seg, i) => {
            const startV = weekIdxToVisualIdx(seg.idx);
            // seg.weekSpan 주가 커버하는 마지막 주의 시작 visual index
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
                  gridColumn: `${startV + 1} / ${endV + 1}`, // CSS grid 1-based
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
        {/* 요일 라벨 영역 */}
        <div
          className="relative text-xs"
          style={{
            width: 28,
            display: 'grid',
            gridTemplateRows: `repeat(7, ${CELL}px)`,
            rowGap: GAP,
            height: `calc(${CELL * 7 + GAP * 6}px)`,
          }}
        >
          {DAY_SHORT.map((dShort, rowIdx) => (
            <div key={dShort} className="relative" style={{ height: CELL }}>
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

        {/* 그래프 그리드 (spacer 포함한 시각적 컬럼 구조) */}
        <div
          role="grid"
          aria-readonly="true"
          className="grid"
          style={{
            gridTemplateColumns,
            gridTemplateRows: `repeat(7, ${CELL}px)`,
            columnGap: GAP,
            rowGap: GAP,
          }}
        >
          {/* spacer 컬럼은 세로로 빈 칸 하나를 전체 행 높이로 차지 */}
          {visualCols.map((vc, vColIdx) => {
            if (vc.kind === 'spacer') {
              return (
                <div
                  key={`sp-${vColIdx}`}
                  aria-hidden="true"
                  style={{
                    gridColumn: vColIdx + 1,
                    gridRow: `1 / span 7`,
                    width: QUARTER_EXTRA_GAP,
                  }}
                />
              );
            }

            // week 컬럼: 각 요일 셀을 해당 grid 좌표에 직접 배치
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
                        width: CELL,
                        height: CELL,
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
