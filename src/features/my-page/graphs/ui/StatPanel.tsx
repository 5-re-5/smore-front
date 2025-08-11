import type { FunctionComponent } from 'react';
import { useStatPanel } from '../model/useStatPanel';

type Props = { userId: string };

function formatFocusTime(start: string, end: string) {
  // "06:00" -> "오전 6시", "13:00" -> "오후 1시"
  const format = (t: string) => {
    const [h] = t.split(':');
    const hour = Number(h);
    if (hour === 0) return '오전 12시';
    if (hour < 12) return `오전 ${hour}시`;
    if (hour === 12) return '오후 12시';
    return `오후 ${hour - 12}시`;
  };
  return `${format(start)}~${format(end)}`;
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}

const StatPanel: FunctionComponent<Props> = ({ userId }) => {
  const { panel, loading } = useStatPanel(userId);

  return (
    <div className="relative w-full flex flex-row items-center justify-start gap-[1.562rem] text-center text-[1.625rem] text-darkslategray font-montserrat">
      {/* 3개 패널박스 */}
      <div className="w-[23.75rem] relative shadow-[-10px_-10px_20px_#fff,_10px_10px_20px_rgba(0,_0,_0,_0.09)] rounded-[25px] bg-aliceblue h-[12.5rem] z-[0]" />
      <div className="w-[23.75rem] relative shadow-[-10px_-10px_20px_#fff,_10px_10px_20px_rgba(0,_0,_0,_0.09)] rounded-[25px] bg-aliceblue h-[12.5rem] z-[1]" />
      <div className="w-[23.75rem] relative shadow-[-10px_-10px_20px_#fff,_10px_10px_20px_rgba(0,_0,_0,_0.09)] rounded-[25px] bg-aliceblue h-[12.5rem] z-[2]" />

      {/* 텍스트 레이블 */}
      <div className="w-[17.563rem] absolute !!m-[0 important] top-[3.063rem] left-[3.063rem] font-semibold inline-block h-[2.169rem] z-[3]">
        최고 집중 시간대
      </div>
      <div className="w-[17.563rem] absolute !!m-[0 important] top-[3.063rem] left-[28.375rem] font-semibold inline-block h-[2.169rem] z-[4]">
        최저 집중 시간대
      </div>
      <div className="w-[17.563rem] absolute !!m-[0 important] top-[3.063rem] left-[54.125rem] font-semibold inline-block h-[2.169rem] z-[5]">
        평균 집중 유지 시간
      </div>

      {/* 텍스트 내용 */}
      <div className="w-[19.063rem] absolute !!m-[0 important] top-[6.25rem] left-[2.313rem] text-[2.125rem] font-semibold text-lightseagreen inline-block h-[5.625rem] z-[6]">
        {loading || !panel
          ? '로딩 중...'
          : formatFocusTime(
              panel.best_focus_time.start,
              panel.best_focus_time.end,
            )}
      </div>
      <div className="w-[19.063rem] absolute !!m-[0 important] top-[6.25rem] left-[27.625rem] text-[2.125rem] font-semibold text-lightseagreen inline-block h-[4.788rem] z-[7]">
        {loading || !panel
          ? '로딩 중...'
          : formatFocusTime(
              panel.worst_focus_time.start,
              panel.worst_focus_time.end,
            )}
      </div>
      <div className="w-[18.875rem] absolute !!m-[0 important] top-[6.438rem] left-[53.5rem] text-[2.125rem] font-semibold text-lightseagreen inline-block h-[5.125rem] z-[8]">
        {loading || !panel
          ? '로딩 중...'
          : formatMinutes(panel.average_focus_duration)}
      </div>

      {/* 우측 툴팁/아이콘 등 기타 */}
      <div className="w-[2.5rem] absolute !!m-[0 important] top-[1.438rem] left-[69.875rem] h-[3.313rem] z-[9] text-[0.625rem] text-tomato">
        <div className="absolute top-[0rem] left-[0rem] rounded-[50px] w-[2.5rem] h-[2.5rem] overflow-hidden flex flex-col items-center justify-center p-[0.625rem] box-border">
          <img
            className="w-[1.5rem] relative h-[1.5rem]"
            alt=""
            src="bx-comment.svg.svg"
          />
        </div>
        <div className="absolute top-[0.813rem] left-[0.125rem] font-semibold inline-block w-[2.375rem] h-[2.5rem]">
          ?
        </div>
      </div>
    </div>
  );
};

export default StatPanel;
