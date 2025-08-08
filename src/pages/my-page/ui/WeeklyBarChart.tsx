import type { FunctionComponent } from 'react';
import React, { useEffect, useState } from 'react';

type Props = {
  userId: string;
};

const WeeklyBarChart: FunctionComponent<Props> = ({ userId }) => {
  const graphWidthClass = 'w-[55.063rem]';

  // 목데이터 - 이번주, 주별 평균 각각 (월~일)
  const mockWeekdayGraph = [6, 4, 2, 12, 4, 0, 3]; // 이번주 예시
  const mockAvgWeekdayGraph = [5, 5, 3, 8, 6, 2, 2]; // 주별평균 예시

  const [selected, setSelected] = useState<'week' | 'avg'>('week');
  const [weekdayGraph, setWeekdayGraph] = useState<number[] | null>(null);
  const [avgWeekdayGraph, setAvgWeekdayGraph] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 최대 바 높이 (px)
  const maxBarHeightPx = 330;

  useEffect(() => {
    setLoading(true);
    // 실제 백엔드 연동 코드(현재 주석)
    /*
    fetch(`/api/v1/study-times/statistics/${userId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`API 에러: ${res.status}`);
        const json = await res.json();
        setWeekdayGraph(json.data.weekday_graph);
        setAvgWeekdayGraph(json.data.weekly_avg_graph); // 백엔드에 맞게 필드명 조정
      })
      .catch((e) => setError(e.message ?? "네트워크 오류"))
      .finally(() => setLoading(false));
    */

    // 목데이터
    setWeekdayGraph(mockWeekdayGraph);
    setAvgWeekdayGraph(mockAvgWeekdayGraph);
    setLoading(false);
  }, [userId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!weekdayGraph || !avgWeekdayGraph) return <div>데이터 없음</div>;

  // 토글에 따라 표시할 데이터 선택
  const data = selected === 'week' ? weekdayGraph : avgWeekdayGraph;
  const maxHours = Math.max(...data, 12);
  const leftPositions = [
    4.063, // 월
    12.125, // 화
    19.5, // 수
    27.188, // 목
    34.563, // 금
    42.188, // 토
    49.688, // 일
  ];
  const bars = data.map((hours, idx) => {
    const height = (hours / maxHours) * maxBarHeightPx;
    return (
      <div
        key={idx}
        className="absolute w-[3.5rem] bg-deepskyblue rounded-t-[5px] z-[10]"
        style={{
          bottom: 0,
          left: `${leftPositions[idx]}rem`,
          height: `${height}px`,
          transition: 'height 0.3s ease',
        }}
        title={`${['월', '화', '수', '목', '금', '토', '일'][idx]}: ${hours}시간`}
      />
    );
  });

  return (
    <div
      className={`
        relative
        w-full
        max-w-[75rem]
        min-w-[320px]
        mx-auto
        box-border
      `}
    >
      {/* 그래프 영역 */}
      <div
        className={`${graphWidthClass} mx-auto relative flex flex-row items-start justify-center`}
      >
        <div className="w-full relative h-[26.313rem] z-[2] text-[1rem] text-darkslategray-200">
          {/* 기존 절대 위치 요소들 유지 */}
          <div className="absolute top-[21.031rem] left-[2.281rem] border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem]" />
          <div className="absolute top-[17.594rem] left-[2.281rem] border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem]" />
          <div className="absolute top-[14.219rem] left-[2.281rem] border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem]" />
          <div className="absolute top-[10.844rem] left-[2.281rem] border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem]" />
          <div className="absolute top-[7.469rem] left-[2.281rem] border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem]" />
          <div className="absolute top-[4.094rem] left-[2.281rem] border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem]" />
          <div className="absolute top-[0.719rem] left-[2.281rem] border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem]" />
          <div className="absolute top-[20.25rem] left-[0.188rem]">0</div>
          <div className="absolute top-[16.875rem] left-[0.188rem]">2</div>
          <div className="absolute top-[13.5rem] left-[0.188rem]">4</div>
          <div className="absolute top-[10.125rem] left-[0.188rem]">6</div>
          <div className="absolute top-[6.75rem] left-[0.188rem]">8</div>
          <div className="absolute top-[3.375rem] left-[0rem]">10</div>
          <div className="absolute top-[0rem] left-[0.063rem]">12</div>
          <div className="absolute top-[22.563rem] left-[49.375rem] text-[1.25rem] font-inter text-black text-center inline-block w-[4.063rem] h-[3.75rem]">
            일
          </div>
          <div className="absolute top-[22.625rem] left-[40.875rem] text-[1.25rem] font-inter text-black text-center inline-block w-[6.063rem] h-[2.375rem]">
            토
          </div>
          <div className="absolute top-[22.625rem] left-[34.563rem] text-[1.25rem] font-inter text-black text-center inline-block w-[3.563rem] h-[1.25rem]">
            금
          </div>
          <div className="absolute top-[22.5rem] left-[26.813rem] text-[1.25rem] font-inter text-black text-center inline-block w-[4.188rem] h-[2.75rem]">
            목
          </div>
          <div className="absolute top-[22.625rem] left-[18.688rem] text-[1.25rem] font-inter text-black text-center inline-block w-[5.125rem] h-[2.438rem]">
            수
          </div>
          <div className="absolute top-[22.625rem] left-[10.25rem] text-[1.25rem] font-inter text-black text-center inline-block w-[6.875rem] h-[3.563rem]">
            화
          </div>
          <div className="absolute top-[22.625rem] left-[3.438rem] text-[1.25rem] font-inter text-black text-center inline-block w-[4.75rem] h-[1.938rem]">
            월
          </div>
          {bars}
        </div>
      </div>
    </div>
  );
};

export default WeeklyBarChart;
