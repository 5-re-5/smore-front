import React, { useEffect, useState } from 'react';

type Props = {
  userId: string;
};

type ApiResponse = {
  data: {
    weekly_graph: number[]; // 1~5주차 공부 시간(시간 단위)
  };
};

// 예시 목데이터 (1~5주차 주 평균 공부시간)
const mockWeeklyGraph = [6.5, 8, 9.5, 7, 8.5];

const WeeklyAvgBarChart: React.FC<Props> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weeklyGraph, setWeeklyGraph] = useState<number[] | null>(null);

  useEffect(() => {
    setLoading(true);
    // 실제 API 연동 예시 (주석 처리 상태)
    /*
    fetch(`/api/v1/study-times/statistics/${userId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`API 에러: ${res.status}`);
        const json: ApiResponse = await res.json();
        setWeeklyGraph(json.data.weekly_graph);
      })
      .catch((e) => {
        setError(e.message || "네트워크 오류");
        setWeeklyGraph(mockWeeklyGraph);
      })
      .finally(() => setLoading(false));
    */
    // 목데이터로 임시 세팅
    setWeeklyGraph(mockWeeklyGraph);
    setLoading(false);
  }, [userId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!weeklyGraph) return <div>데이터 없음</div>;

  // 최대 12시간, 막대 최대 높이(px) 계산, 막대 좌측 위치(rem 단위)
  const maxHours = 12;
  const maxBarHeight = 20 * 16; // px (20rem 기준)
  const leftRems = [18.188, 27.313, 36.438, 45.563, 54.188].slice(
    0,
    weeklyGraph.length,
  );

  const bars = weeklyGraph.map((hour, idx) => {
    const height = Math.max(8, (hour / maxHours) * maxBarHeight); // 최소 8px 보장
    const left = leftRems[idx];
    return (
      <div
        key={idx}
        className="absolute w-[3.5rem] rounded-t-[9px] bg-deepskyblue shadow-[0_4px_12px_rgba(52,179,241,0.15)]"
        style={{
          left: `${left}rem`,
          bottom: 0,
          height: `${height}px`,
          transition: 'height 0.3s',
        }}
        title={`${idx + 1}주차: ${hour}시간`}
      />
    );
  });

  return (
    <div className="w-full relative rounded-[14px] h-[37.5rem] overflow-hidden text-center text-[1rem] text-black font-inter">
      <div className="absolute top-[3.5rem] left-[4.938rem] w-[55.063rem] h-[28.688rem] text-left text-darkslategray font-poppins">
        {/* y축 레이블 */}
        <div className="absolute top-[27.188rem] left-[0.188rem]">0</div>
        <div className="absolute top-[23.813rem] left-[0.188rem]">2</div>
        <div className="absolute top-[20.438rem] left-[0.188rem]">4</div>
        <div className="absolute top-[17.063rem] left-[0.188rem]">6</div>
        <div className="absolute top-[13.688rem] left-[0.188rem]">8</div>
        <div className="absolute top-[10.313rem] left-[0rem]">10</div>
        <div className="absolute top-[6.938rem] left-[0.063rem]">12</div>

        {/* 기준선 */}
        <div className="absolute top-[27.969rem] left-[2.281rem] border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem]" />
        <div className="absolute top-[24.531rem] left-[2.281rem] border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem]" />
        <div className="absolute top-[21.156rem] left-[2.281rem] border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem]" />
        <div className="absolute top-[17.781rem] left-[2.281rem] border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem]" />
        <div className="absolute top-[14.406rem] left-[2.281rem] border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem]" />
        <div className="absolute top-[11.031rem] left-[2.281rem] border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem]" />
        <div className="absolute top-[7.656rem] left-[2.281rem] border-lightgray border-dashed border-t-[1px] box-border w-[52.813rem] h-[0.063rem]" />

        {/* 주차 레이블(위치를 34.5rem 정도로 내려줌) */}
        <div className="absolute top-[34.5rem] left-[16.125rem] text-[1.25rem] inline-block w-[7.563rem] h-[1.438rem]">
          1주차
        </div>
        <div className="absolute top-[34.5rem] left-[26.375rem] text-[1.25rem] inline-block w-[5.375rem] h-[1.938rem]">
          2주차
        </div>
        <div className="absolute top-[34.5rem] left-[35.563rem] text-[1.25rem] inline-block w-[5.188rem] h-[2.813rem]">
          3주차
        </div>
        <div className="absolute top-[34.5rem] left-[44.563rem] text-[1.25rem] inline-block w-[6.063rem] h-[2.375rem]">
          4주차
        </div>
        <div className="absolute top-[34.5rem] left-[54.188rem] text-[1.25rem] inline-block w-[6.063rem] h-[2.375rem]">
          5주차
        </div>

        {/* 막대그래프 */}
        <div className="absolute left-0 bottom-0 w-full h-[28.688rem]">
          {bars}
        </div>
      </div>
      {/* 기타 배경 이미지, 텍스트 등 기존 디자인 그대로 유지 */}
    </div>
  );
};

export default WeeklyAvgBarChart;
