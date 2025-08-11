import type { FunctionComponent } from 'react';
import { useWeeklyAvgBarChart } from '../model/useWeeklyAvgBarChart';

type Props = { userId: string };

const maxHours = 12;
const maxBarHeight = 20 * 16; // px (20rem)
const leftRems = [18.188, 27.313, 36.438, 45.563, 54.188];

const WeeklyAvgBarChart: FunctionComponent<Props> = ({ userId }) => {
  const { weeklyGraph, loading, error } = useWeeklyAvgBarChart(userId);

  // 그래프 막대 (데이터 없거나 로딩/에러 시에는 플레이스홀더로 표시)
  const bars = (weeklyGraph ?? Array(leftRems.length).fill(0)).map(
    (hour, idx) => {
      const height = loading
        ? 24
        : Math.max(8, (hour / maxHours) * maxBarHeight);
      const left = leftRems[idx];
      const barTitle = loading
        ? '로딩 중'
        : error
          ? '데이터 없음'
          : `${idx + 1}주차: ${hour}시간`;

      const barBg =
        loading || error
          ? 'bg-gray-200 opacity-40'
          : 'bg-deepskyblue shadow-[0_4px_12px_rgba(52,179,241,0.15)]';

      return (
        <div
          key={idx}
          className={`absolute w-[3.5rem] rounded-t-[9px] ${barBg}`}
          style={{
            left: `${left}rem`,
            bottom: 0,
            height: `${height}px`,
            transition: 'height 0.3s',
          }}
          title={barTitle}
        />
      );
    },
  );

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

        {/* 주차 레이블 */}
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

        {/* 그래프 막대 */}
        <div className="absolute left-0 bottom-0 w-full h-[28.688rem]">
          {bars}
        </div>

        {/* 로딩/에러 메시지 (그래프 틀 아래쪽 혹은 원하는 위치에 추가 가능) */}
        {(loading || error) && (
          <div className="absolute bottom-[-2.5rem] left-0 w-full text-center text-red-600 text-sm">
            {loading ? '로딩 중...' : `에러 발생: ${error}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyAvgBarChart;
