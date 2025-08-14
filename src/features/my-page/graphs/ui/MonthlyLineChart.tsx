// MonthlyLineChart.tsx
import { useMemo, type FunctionComponent } from 'react';
import { useMonthlyLineChart } from '../model/useMonthlyLineChart';

type Props = { userId: string };

const NUM_DAYS = 30;
const maxHour = 12;

// 반응형 viewBox
const VB_W = 1000;
const VB_H = 600;

// 여백
const CLIP_PAD = 14; // 선 굵기·마커 반지름·글로우 여유. 10~16 사이에서 취향껏
const M = { top: 90, right: 40, bottom: 90, left: 70 };
const CHART_W = VB_W - M.left - M.right;
const CHART_H = VB_H - M.top - M.bottom;
const STEP_X = CHART_W / (NUM_DAYS - 1);

/* -------------------- 유틸 -------------------- */
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const clampHour = (h: number) => clamp(h, 0, maxHour);

/** API 일자 배열 → 0.1시간 단위(0~12로 클램프) */
function getHoursArr(arr: { date: string; minutes: number }[]) {
  return Array.from({ length: NUM_DAYS }, (_, i) => {
    const day = i + 1;
    const data = arr.find((a) => Number(a.date.split('-')[2]) === day);
    if (!data) return 0;
    const hr = Math.round((Math.max(0, data.minutes) / 60) * 10) / 10;
    return clampHour(hr);
  });
}

const x = (i: number) => i * STEP_X;
const y = (hour: number) => {
  const h = clampHour(hour);
  return CHART_H - (h / maxHour) * CHART_H;
};

/** Catmull-Rom → Cubic Bezier (컨트롤 포인트/차트 범위 클램프) */
function makeSmoothPathFromHoursClamped(
  hours: number[],
  tension = 0.45,
): string {
  const n = hours.length;
  if (n === 0) return '';
  const pts = hours.map((h, i) => [x(i), y(h)] as const);

  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  if (n === 1) return d;

  for (let i = 0; i < n - 1; i++) {
    const p0 = i > 0 ? pts[i - 1] : pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = i + 2 < n ? pts[i + 2] : pts[i + 1];

    const [x0, y0] = p0;
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    const [x3, y3] = p3;

    const t = tension;
    let c1x = x1 + (x2 - x0) * (t / 6);
    let c1y = y1 + (y2 - y0) * (t / 6);
    let c2x = x2 - (x3 - x1) * (t / 6);
    let c2y = y2 - (y3 - y1) * (t / 6);

    // 컨트롤 X: 구간 내로
    if (x2 < x1) {
      c1x = clamp(c1x, x2, x1);
      c2x = clamp(c2x, x2, x1);
    } else {
      c1x = clamp(c1x, x1, x2);
      c2x = clamp(c2x, x1, x2);
    }

    // 컨트롤 Y: 구간/차트 범위로
    const segMinY = Math.min(y1, y2);
    const segMaxY = Math.max(y1, y2);
    c1y = clamp(c1y, segMinY, segMaxY);
    c2y = clamp(c2y, segMinY, segMaxY);
    c1y = clamp(c1y, 0, CHART_H);
    c2y = clamp(c2y, 0, CHART_H);

    if (Math.abs(y1 - y2) < 0.1) {
      c1y = y1;
      c2y = y2;
    }

    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
  }
  return d;
}

/** 영역 채우기 패스 생성 (곡선 path + 아래로 닫기) */
function makeAreaPath(hours: number[]): string {
  if (hours.length === 0) return '';
  const smoothPath = makeSmoothPathFromHoursClamped(hours, 0.45);
  if (!smoothPath) return '';
  const startX = x(0);
  const endX = x(hours.length - 1);
  const bottomY = CHART_H;
  return `${smoothPath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
}

/* -------------------- 컴포넌트 -------------------- */
const MonthlyLineChart: FunctionComponent<Props> = ({ userId }) => {
  const {
    thisMonth,
    prevMonth,
    thisMonthLabel,
    prevMonthLabel,
    loading,
    error,
  } = useMonthlyLineChart(userId);

  const hours = getHoursArr(thisMonth).map(clampHour);
  const prevHours = getHoursArr(prevMonth).map(clampHour);

  // 안전한 고유 ID (SVG url(#id) 호환)
  const uid = useMemo(() => 'mlc-' + Math.random().toString(36).slice(2), []);
  const clipId = `${uid}-clip`;
  const thisMonthGradientId = `${uid}-g-this`;
  const prevMonthGradientId = `${uid}-g-prev`;
  const thisMonthAreaGradientId = `${uid}-ga-this`;
  const prevMonthAreaGradientId = `${uid}-ga-prev`;

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 rounded-[25px] shadow min-h-[20rem]">
        <div className="text-slate-600 text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div
      className="
        w-full max-w-[1047px] bg-gradient-to-br from-slate-50 via-white to-blue-50
        rounded-[25px] shadow-[0_8px_40px_rgba(0,0,0,0.08)]
        mx-auto relative p-6
        font-poppins text-slate-700 border border-slate-100
      "
      style={{ aspectRatio: '1000 / 600', minHeight: 360 }}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* 차트 영역 클리핑: 좌표계는 userSpaceOnUse, (0,0)~(W,H) */}
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <rect
              x={-CLIP_PAD}
              y={-CLIP_PAD}
              width={CHART_W + CLIP_PAD * 2}
              height={CHART_H + CLIP_PAD * 2}
            />
          </clipPath>

          {/* 이번 달 선 그라데이션 */}
          <linearGradient
            id={thisMonthGradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </linearGradient>

          {/* 지난 달 선 그라데이션 */}
          <linearGradient
            id={prevMonthGradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#64748b" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.6" />
          </linearGradient>

          {/* 이번 달 영역 그라데이션 */}
          <linearGradient
            id={thisMonthAreaGradientId}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
          </linearGradient>

          {/* 지난 달 영역 그라데이션 */}
          <linearGradient
            id={prevMonthAreaGradientId}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#64748b" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.01" />
          </linearGradient>

          {/* 드롭 섀도우 / 글로우 */}
          <filter
            id={`${uid}-drop`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor="#000"
              floodOpacity="0.1"
            />
          </filter>
          <filter
            id={`${uid}-glow`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 제목 */}
        <text
          x={M.left - 35}
          y={22}
          fill="#1e293b"
          fontSize={24}
          fontWeight={700}
        >
          월별 공부 시간 통계
        </text>

        {/* 범례 */}
        <g transform={`translate(${M.left - 30}, ${58})`} fontSize={15}>
          <rect
            x={0}
            y={-12}
            width={14}
            height={14}
            fill={`url(#${prevMonthGradientId})`}
            rx={3}
          />
          <text x={22} y={0} fill="#64748b" fontWeight={600}>
            지난 달{prevMonthLabel ? ` (${prevMonthLabel})` : ''}
          </text>
          <rect
            x={240}
            y={-12}
            width={14}
            height={14}
            fill={error ? '#cbd5e1' : `url(#${thisMonthGradientId})`}
            rx={3}
          />
          <text x={262} y={0} fill="#1e293b" fontWeight={600}>
            이번 달{thisMonthLabel ? ` (${thisMonthLabel})` : ''}
          </text>
        </g>

        {/* 그리드/라벨 */}
        <g transform={`translate(${M.left}, ${M.top})`}>
          {[0, 2, 4, 6, 8, 10, 12].map((t) => (
            <g key={`yt-${t}`}>
              <line
                x1={0}
                y1={y(t)}
                x2={CHART_W}
                y2={y(t)}
                stroke="#e2e8f0"
                strokeDasharray="4 8"
                strokeWidth={3}
                opacity={0.6}
              />
              <text
                x={-16}
                y={y(t)}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#64748b"
                fontSize={13}
                fontWeight={500}
              >
                {t}
              </text>
            </g>
          ))}
          {[1, 5, 10, 15, 20, 25, 30].map((d) => (
            <text
              key={`xt-${d}`}
              x={x(d - 1)}
              y={CHART_H + 26}
              textAnchor="middle"
              fill="#64748b"
              fontSize={13}
              fontWeight={500}
            >
              {d}일
            </text>
          ))}
        </g>

        {/* 선/점/영역 (clipPath 적용: (0,0)~(CHART_W,CHART_H)) */}
        <g
          transform={`translate(${M.left}, ${M.top})`}
          clipPath={`url(#${clipId})`}
        >
          {/* 지난달 영역 */}
          <path
            d={makeAreaPath(prevHours)}
            fill={`url(#${prevMonthAreaGradientId})`}
            opacity={0.7}
          />
          {/* 이번달 영역 */}
          <path
            d={makeAreaPath(hours)}
            fill={error ? '#f1f5f9' : `url(#${thisMonthAreaGradientId})`}
            opacity={error ? 0.3 : 0.8}
          />

          {/* 지난달 곡선 */}
          <path
            d={makeSmoothPathFromHoursClamped(prevHours, 0.45)}
            fill="none"
            stroke={`url(#${prevMonthGradientId})`}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
            vectorEffect="non-scaling-stroke"
            filter={`url(#${uid}-drop)`}
          />
          {/* 이번달 곡선 */}
          <path
            d={makeSmoothPathFromHoursClamped(hours, 0.45)}
            fill="none"
            stroke={error ? '#cbd5e1' : `url(#${thisMonthGradientId})`}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={error ? 0.5 : 1}
            vectorEffect="non-scaling-stroke"
            filter={error ? undefined : `url(#${uid}-glow)`}
          />

          {/* 데이터 포인트 마커 */}
          {/* {prevHours.map((h, i) =>
            h > 0 ? (
              <g key={`p${i}`}>
                <circle cx={x(i)} cy={y(h)} r={6} fill="white" stroke={`url(#${prevMonthGradientId})`} strokeWidth={2} opacity={0.9} />
                <circle cx={x(i)} cy={y(h)} r={3} fill={`url(#${prevMonthGradientId})`} />
              </g>
            ) : null
          )} */}
          {/* {hours.map((h, i) =>
            h > 0 ? (
              <g key={`c${i}`}>
                <circle
                  cx={x(i)}
                  cy={y(h)}
                  r={7}
                  fill="white"
                  stroke={error ? '#cbd5e1' : `url(#${thisMonthGradientId})`}
                  strokeWidth={3}
                  vectorEffect="non-scaling-stroke"
                  filter={`url(#${uid}-drop)`}
                />
                <circle cx={x(i)} cy={y(h)} r={4} fill={error ? '#cbd5e1' : `url(#${thisMonthGradientId})`} />
              </g>
            ) : null
          )} */}
        </g>

        {/* 에러 메시지 */}
        {error && (
          <text
            x={VB_W / 2}
            y={VB_H - 12}
            textAnchor="middle"
            fill="#ef4444"
            fontSize={14}
            fontWeight={500}
          >
            에러 발생: {error}
          </text>
        )}
      </svg>
    </div>
  );
};

export default MonthlyLineChart;
