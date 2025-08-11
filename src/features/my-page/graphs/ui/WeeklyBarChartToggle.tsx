import React, { useState } from 'react';
import WeeklyBarChart from './WeeklyBarChart';
import WeeklyAvgBarChart from './WeeklyAvgBarChart';

type Props = {
  userId: string;
};

const TOGGLE_LEFT = 0;
const TOGGLE_RIGHT = 5.548; // 단위 rem

const WeeklyBarChartToggle: React.FC<Props> = ({ userId }) => {
  const [selected, setSelected] = useState<'week' | 'avg'>('week');

  // 조건에 따른 텍스트 결정
  const headerText =
    selected === 'week' ? '주간 공부 시간 통계' : '주 평균 공부 시간';

  return (
    <div className="relative w-full max-w-[75rem] mx-auto">
      {/* 상단: 텍스트(조건부) 왼쪽, 토글바 오른쪽, flex 한줄 레이아웃 */}
      <div className="flex flex-row items-center justify-between mb-4 px-0">
        {/* 텍스트: 왼쪽 정렬 */}
        <div className="font-medium text-[1.25rem] text-black font-poppins whitespace-nowrap">
          {headerText}
        </div>

        {/* 토글바: 오른쪽 정렬 */}
        <div className="relative h-[3.125rem] w-[11.25rem] text-center text-[0.875rem] font-open-sans text-darkgray select-none">
          {/* 전체 바탕 */}
          <div className="absolute top-[-0.062rem] left-[-0.062rem] rounded-[50px] bg-aliceblue border border-gray-200 shadow-[5px_5px_4px_rgba(174,_174,_192,_0.2)_inset,-5px_-5px_4px_rgba(255,_255,_255,_0.3)_inset] w-[11.375rem] h-[3.25rem] pointer-events-none" />
          {/* 볼록 배경 */}
          <div
            className={`absolute h-[92%] top-[4%] rounded-[20px] bg-aliceblue border border-gray-100 shadow-[-2px_-2px_4px_rgba(0,0,0,0.1)_inset,2px_2px_4px_#fff_inset,-5px_-5px_5px_rgba(255,255,255,0.5),5px_5px_10px_rgba(174,174,192,0.2)] w-[5.388rem] transition-all duration-200 ease-in-out`}
            style={{
              left:
                selected === 'week'
                  ? `${TOGGLE_LEFT}rem`
                  : `${TOGGLE_RIGHT}rem`,
              opacity: 1,
            }}
          />
          {/* '이번주' 버튼 */}
          <button
            onClick={() => setSelected('week')}
            className={`absolute top-0 left-0 w-[5.388rem] h-[3.125rem] rounded-[20px] flex items-center justify-center font-semibold cursor-pointer transition-colors duration-150
              ${selected === 'week' ? 'text-darkslategray' : 'text-darkgray'} z-10`}
            type="button"
            aria-pressed={selected === 'week'}
            tabIndex={0}
          >
            이번주
          </button>
          {/* '주별 평균' 버튼 */}
          <button
            onClick={() => setSelected('avg')}
            className={`absolute top-0 left-[5.548rem] w-[5.388rem] h-[3.125rem] rounded-[20px] flex items-center justify-center font-semibold cursor-pointer transition-colors duration-150
              ${selected === 'avg' ? 'text-darkslategray' : 'text-darkgray'} z-10`}
            type="button"
            aria-pressed={selected === 'avg'}
            tabIndex={0}
          >
            주별 평균
          </button>
        </div>
      </div>
      {/* 그래프 본문: 바로 아래에 출력 */}
      {selected === 'week' ? (
        <WeeklyBarChart userId={userId} />
      ) : (
        <WeeklyAvgBarChart userId={userId} />
      )}
    </div>
  );
};

export default WeeklyBarChartToggle;
