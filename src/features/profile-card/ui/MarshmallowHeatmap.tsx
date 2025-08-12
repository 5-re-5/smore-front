// MarshmallowHeatmap.tsx
import React, { useEffect, useRef, useState, type FC } from 'react';

type Level = 0 | 1 | 2 | 3 | 4;

/** API 원본 그대로 전달받는 포인트 타입 */
export type StudyPoint = { date: string; minutes: number };

type MarshmallowHeatmapProps = {
  /** API의 study_track.points 그대로 */
  points?: StudyPoint[];
  /** 히트맵 오른쪽 끝 기준 날짜(기본: 오늘) */
  endDate?: string | Date;
};

// ---- 레이아웃 상수 ----
const BASE_CELL = 14.369; // 최대 셀 크기(px)
const GAP = 4; // 컬럼/행 간격(px)
const LABEL_W = 28; // 좌측 요일 라벨 폭(px)
const QUARTER_EXTRA_FACTOR = 8; // 분기 여백 = GAP * 8

// 팔레트(마시멜로 → 진하게)
const PALETTE: [string, string, string, string, string] = [
  '#eee6da', // 0
  '#f9ccb4', // 1
  '#f9a57b', // 2
  '#d67739', // 3
  '#7e4420', // 4
];

// 범례 라벨(분 기준)
const LEVEL_LABELS: [string, string, string, string, string] = [
  '0m',
  '1–60m',
  '61–120m',
  '121–180m',
  '181m+',
];

// ----- date utils -----
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const startOfWeekSunday = (d: Date) => {
  const x = new Date(d);
  const day = x.getDay(); // 0=Sun
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
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
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

// 분기 시작 여부(분기 시작 주에 스페이서 열 추가)
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

/** minutes → level(0..4) */
const minutesToLevel = (m: number): Level => {
  if (m <= 0) return 0 as const;
  if (m <= 60) return 1 as const;
  if (m <= 120) return 2 as const;
  if (m <= 180) return 3 as const;
  return 4 as const;
};

// 날짜 문자열 해시(애니메이션 지연 랜덤성 확보용, SSR 불일치 방지)
const hashString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const MarshmallowHeatmap: FC<MarshmallowHeatmapProps> = ({
  points,
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

  // API 원본(points)을 날짜 → level / minutes 로 맵 보관
  const levelByDate: Record<string, Level> = React.useMemo(() => {
    const map: Record<string, Level> = {};
    (points ?? []).forEach(({ date, minutes }) => {
      map[date] = minutesToLevel(minutes);
    });
    return map;
  }, [points]);

  const minutesByDate: Record<string, number> = React.useMemo(() => {
    const map: Record<string, number> = {};
    (points ?? []).forEach(({ date, minutes }) => {
      map[date] = minutes;
    });
    return map;
  }, [points]);

  // 그리드 데이터(없으면 0)
  const grid: Level[][] = weeks.map((colStart) =>
    Array.from({ length: 7 }, (_, yi) => {
      const cellDate = addDays(colStart, yi);
      const key = toISO(cellDate);
      if (cellDate > end) return 0;
      if (key in levelByDate) return levelByDate[key]!;
      return 0;
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
      const available = Math.max(0, el.clientWidth - LABEL_W);
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
        setCell(Math.max(8, Math.round(newCell * 1000) / 1000));
      }
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [weeks.length, spacerCount, totalCols]);

  // 월 세그먼트 (월 이름 라벨)
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

  // 이글이글(ember) 강도/속도 매핑
  const speedByLevel: Record<Level, string> = {
    0: '0s', // 사용 안 함
    1: '2.2s',
    2: '2.0s',
    3: '1.8s',
    4: '1.6s',
  };
  const blur1ByLevel: Record<Level, string> = {
    0: '0px',
    1: '3px',
    2: '4px',
    3: '5px',
    4: '6px',
  };
  const blur2ByLevel: Record<Level, string> = {
    0: '0px',
    1: '6px',
    2: '8px',
    3: '10px',
    4: '12px',
  };

  return (
    <div
      ref={wrapRef}
      className="w-full py-3 flex flex-col items-start overflow-hidden"
    >
      {/* 🔥 glow keyframes & class */}
      <style>{`
        .mm-cell { position: relative; }
        .mm-ember {
          animation-name: mm-flicker;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
          will-change: transform, box-shadow;
        }
        @keyframes mm-flicker {
          0% {
            transform: translateZ(0) scale(1);
            box-shadow:
              0 0 0 var(--mm-glow, transparent),
              0 0 0 var(--mm-glow, transparent);
          }
          100% {
            transform: translateZ(0) scale(1.05);
            box-shadow:
              0 0 var(--mm-blur1, 6px) var(--mm-glow, transparent),
              0 0 var(--mm-blur2, 12px) var(--mm-glow, transparent);
          }
        }
      `}</style>

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
                    width: GAP * QUARTER_EXTRA_FACTOR,
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
                  const mins = minutesByDate[key] ?? 0;

                  // ember(불꽃) 효과 변수
                  const ember = lvl > 0;
                  const delaySeed = hashString(key) % 9; // 0..8
                  const delay = `${(delaySeed * 0.07).toFixed(2)}s`;

                  return (
                    <div
                      key={`${vColIdx}-${rowIdx}`}
                      role="gridcell"
                      data-date={key}
                      data-level={lvl}
                      data-minutes={mins}
                      aria-selected={false}
                      aria-describedby={`contribution-graph-legend-level-${lvl}`}
                      title={`${key}: ${mins}분`}
                      className={`rounded-[4px] mm-cell ${ember ? 'mm-ember' : ''}`}
                      style={{
                        gridColumn: vColIdx + 1,
                        gridRow: rowIdx + 1,
                        width: cell,
                        height: cell,
                        background: PALETTE[lvl],
                        transition: 'background 0.15s',
                        // glow 변수 주입
                        // @ts-expect-error CSS custom props
                        '--mm-glow': PALETTE[lvl],
                        '--mm-speed': speedByLevel[lvl],
                        '--mm-blur1': blur1ByLevel[lvl],
                        '--mm-blur2': blur2ByLevel[lvl],
                        animationDuration: ember
                          ? speedByLevel[lvl]
                          : undefined,
                        animationDelay: ember ? delay : undefined,
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
            id={`contribution-graph-legend-level-${i}`}
            className="inline-block rounded-[4px] border border-black/5"
            style={{ width: cell, height: cell, background: c }}
            title={LEVEL_LABELS[i]}
            aria-label={LEVEL_LABELS[i]}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default MarshmallowHeatmap;
