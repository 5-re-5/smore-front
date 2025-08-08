import type { FunctionComponent } from 'react';
import React, { useEffect, useState } from 'react';

type Props = {
  userId: string;
};

type ApiDayData = {
  date: string; // '2025-07-18'
  minutes: number;
};

type ApiResponse = {
  data: {
    user_id: number;
    total_attendance: number;
    weekday_graph: number[];
    weekly_graph: number[];
    this_month_track: { points: ApiDayData[] }; // 이번달
    last_month_track: { points: ApiDayData[] }; // 지난달
    // ...그 외
  };
};

const NUM_DAYS = 30; // 한달 30일로 맞춤(축에도 1,5,10,...,30일 있음)

// 목데이터(이번달/지난달 각각 30일치, minutes 단위를 시간으로 환산)
const mockThisMonth = Array.from({ length: NUM_DAYS }).map((_, idx) => ({
  date: `2025-08-${String(idx + 1).padStart(2, '0')}`,
  minutes: Math.floor(Math.random() * 11) * 30 + 60, // 1~10시간, 30분 단위
}));
const mockLastMonth = Array.from({ length: NUM_DAYS }).map((_, idx) => ({
  date: `2025-07-${String(idx + 1).padStart(2, '0')}`,
  minutes: Math.floor(Math.random() * 9) * 32 + 60, // 1~8시간, 랜덤 분
}));

const MonthlyLineChart: FunctionComponent<Props> = ({ userId }) => {
  const [thisMonth, setThisMonth] = useState<ApiDayData[] | null>(null);
  const [lastMonth, setLastMonth] = useState<ApiDayData[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 실제 API 연동(현재 주석처리)
    /*
    fetch(`/api/v1/study-times/statistics/${userId}`)
      .then(async res => {
        if (!res.ok) throw new Error('API 에러');
        const data: ApiResponse = await res.json();
        setThisMonth(data.data.this_month_track.points);
        setLastMonth(data.data.last_month_track.points);
      })
      .catch(() => {
        setThisMonth(mockThisMonth);
        setLastMonth(mockLastMonth);
      })
      .finally(() => setLoading(false));
    */
    // 목데이터
    setThisMonth(mockThisMonth);
    setLastMonth(mockLastMonth);
    setLoading(false);
  }, [userId]);

  if (loading || !thisMonth || !lastMonth) return <div>로딩 중...</div>;

  const leftX = 2.354 * 16;
  const topY = 2.0 * 16;
  const chartW = 52.213 * 16;
  const chartH = 16.125 * 16;
  const maxHour = 12; // y축 최대 12시간
  const stepX = chartW / (NUM_DAYS - 1);

  // minutes -> 시간 변환, 데이터 정렬(혹시 날짜중복/결측 예방)
  const getHoursArr = (arr: ApiDayData[]) => {
    // 1일~30일 순(누락시 0)
    const res: number[] = [];
    for (let i = 1; i <= NUM_DAYS; ++i) {
      const d = arr.find((a) => Number(a.date.split('-')[2]) === i);
      res.push(d ? Math.min(12, Math.round((d.minutes / 60) * 10) / 10) : 0);
    }
    return res;
  };
  const thisHours = getHoursArr(thisMonth);
  const lastHours = getHoursArr(lastMonth);

  // y좌표 (위가 0, 아래로 갈수록 커짐)
  const yPx = (hour: number) => topY + chartH - (hour / maxHour) * chartH;
  const makePoints = (arr: number[]) =>
    arr.map((h, i) => `${leftX + i * stepX},${yPx(h)}`).join(' ');

  return (
    <div
      className="
        relative
        bg-white
        shadow-[6px_6px_54px_rgba(0,_0,_0,_0.05)]
        rounded-[25px]
        grid grid-rows-[] grid-cols-[]
        [justify-content:start] [align-content:start] [column-gap:40px]
        py-[3.125rem] px-[5.187rem] box-border
        text-left text-[0.875rem] text-darkgray font-poppins
        mx-auto
        w-[90vw] max-w-[1047px]
        h-[600px]
        min-w-[320px]
      "
    >
      <div className="absolute top-[6.188rem] left-[13.125rem] inline-block w-[2.813rem] h-[1.313rem]">
        이번 달
      </div>
      <div className="absolute top-[6.188rem] left-[6.625rem] text-gray">
        지난 달
      </div>
      <div className="absolute top-[6.25rem] left-[11.688rem] rounded bg-deepskyblue w-[1rem] h-[1rem]" />
      <div className="absolute top-[6.25rem] left-[5.188rem] rounded bg-gainsboro w-[1rem] h-[1rem]" />
      <div className="w-full absolute top-[9.5rem] left-[5.188rem] h-[24.875rem] text-[1rem] text-darkslategray">
        <div className="absolute top-[23.291rem] left-[2.913rem] w-[49.1rem] h-[1.581rem] flex flex-row items-center justify-start gap-[6.437rem]">
          <div className="relative">1일</div>
          <div className="relative">5일</div>
          <div className="relative">10일</div>
          <div className="relative">15일</div>
          <div className="relative">20일</div>
          <div className="relative">25일</div>
          <div className="relative">30일</div>
        </div>
        <div className="absolute top-[0rem] left-[0rem] w-[0.95rem] h-[22.963rem] flex flex-col items-center justify-start gap-[1.875rem]">
          <div className="self-stretch relative">12</div>
          <div className="self-stretch relative">10</div>
          <div className="self-stretch relative">8</div>
          <div className="self-stretch relative">6</div>
          <div className="self-stretch relative">4</div>
          <div className="self-stretch relative">2</div>
          <div className="self-stretch relative">0</div>
        </div>
        <div className="absolute top-[0.792rem] left-[2.199rem] w-[52.369rem] h-[21.375rem] flex flex-col items-start justify-start gap-[3.375rem]">
          <div className="w-[52.813rem] relative border-lightgray border-dashed border-t-[1px] box-border h-[0.063rem]" />
          <div className="w-[52.813rem] relative border-lightgray border-dashed border-t-[1px] box-border h-[0.063rem]" />
          <div className="w-[52.813rem] relative border-lightgray border-dashed border-t-[1px] box-border h-[0.063rem]" />
          <div className="w-[52.813rem] relative border-lightgray border-dashed border-t-[1px] box-border h-[0.063rem]" />
          <div className="w-[52.813rem] relative border-lightgray border-dashed border-t-[1px] box-border h-[0.063rem]" />
          <div className="w-[52.813rem] relative border-lightgray border-dashed border-t-[1px] box-border h-[0.063rem]" />
          <div className="self-stretch relative border-lightgray border-dashed border-t-[1px] box-border h-[0.063rem]" />
        </div>
        {/* 동적 라인그래프(svg) 추가. 기존 img 대신 디자인(위치/크기) 절대 고정 */}
        <svg
          className="absolute top-[2rem] left-[1.796rem]"
          width={53.269 * 16}
          height={16.125 * 16}
          style={{ pointerEvents: 'none' }}
        >
          {/* 이번달 - 진한색 */}
          <polyline
            fill="none"
            stroke="#0478ff"
            strokeWidth={4}
            points={makePoints(thisHours)}
            opacity={0.96}
          />
          {/* 포인트 강조점(이번달) */}
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
        <svg
          className="absolute top-[7.188rem] left-[2.354rem]"
          width={52.213 * 16}
          height={10.625 * 16}
          style={{ pointerEvents: 'none' }}
        >
          {/* 지난달 - 연한색 */}
          <polyline
            fill="none"
            stroke="#e3e3e4"
            strokeWidth={4}
            points={makePoints(lastHours)}
            opacity={0.7}
          />
          {/* 포인트 강조점(지난달) */}
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
        {/* 기존 이미지, 라벨 등 나머지 유지 */}
      </div>
      {/* 하단 툴팁(예시) 등 모두 유지, 필요하면 동적으로 바꿀 수도 있음 */}
      <div className="absolute top-[7.125rem] left-[18.625rem] w-[55.063rem] h-[1.875rem] text-[1rem] text-white">
        <div className="absolute top-[0rem] left-[0rem] rounded-[35px] bg-royalblue w-[5.188rem] h-[2.75rem] flex flex-row items-start justify-start py-[0.625rem] px-[1.812rem] box-border">
          <div className="relative">8일</div>
        </div>
        <img
          className="absolute top-[2.5rem] left-[1.813rem] rounded-[1px] w-[0.625rem] h-[0.813rem] object-contain"
          alt=""
          src="화살표 컴포넌트.svg"
        />
      </div>
      <div className="absolute top-[10.594rem] left-[19.594rem] rounded-[50%] bg-dodgerblue border-white border-solid border-[3px] box-border w-[1.75rem] h-[1.75rem]" />
      <div className="absolute top-[3.125rem] left-[5.188rem] text-[1.25rem] font-medium text-black">
        월별 공부 시간 통계
      </div>
    </div>
  );
};

export default MonthlyLineChart;
