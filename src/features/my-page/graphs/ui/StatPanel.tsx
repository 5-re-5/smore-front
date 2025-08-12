import type { FunctionComponent } from 'react';
import { useStatPanel } from '../model/useStatPanel';

type Props = { userId: string };

const StatPanel: FunctionComponent<Props> = ({ userId }) => {
  const { panel, loading, formatFocusTime, formatMinutes } =
    useStatPanel(userId);

  return (
    <div className="relative w-full flex flex-row items-center justify-start gap-[1.562rem] font-montserrat text-darkslategray">
      {/* 박스 3개 (카드 내부 가운데 정렬 flex) */}
      <div className="w-[23.75rem] h-[12.5rem] rounded-[25px] bg-aliceblue shadow-[-10px_-10px_20px_#fff,10px_10px_20px_rgba(0,0,0,0.09)] flex flex-col items-center justify-center">
        {/* 레이블 */}
        <div className="font-semibold" style={{ fontSize: '26px' }}>
          최고 집중 시간대
        </div>
        {/* 값 */}
        <div
          className="font-semibold"
          style={{ fontSize: '34px', color: '#29BDBC' }}
        >
          {loading || !panel
            ? '로딩 중...'
            : formatFocusTime(
                panel.best_focus_time.start,
                panel.best_focus_time.end,
              )}
        </div>
      </div>

      <div className="w-[23.75rem] h-[12.5rem] rounded-[25px] bg-aliceblue shadow-[-10px_-10px_20px_#fff,10px_10px_20px_rgba(0,0,0,0.09)] flex flex-col items-center justify-center">
        <div className="font-semibold" style={{ fontSize: '26px' }}>
          최저 집중 시간대
        </div>
        <div
          className="font-semibold"
          style={{ fontSize: '34px', color: '#29BDBC' }}
        >
          {loading || !panel
            ? '로딩 중...'
            : formatFocusTime(
                panel.worst_focus_time.start,
                panel.worst_focus_time.end,
              )}
        </div>
      </div>

      <div className="w-[23.75rem] h-[12.5rem] rounded-[25px] bg-aliceblue shadow-[-10px_-10px_20px_#fff,10px_10px_20px_rgba(0,0,0,0.09)] flex flex-col items-center justify-center">
        <div className="font-semibold" style={{ fontSize: '26px' }}>
          평균 집중 유지 시간
        </div>
        <div
          className="font-semibold"
          style={{ fontSize: '34px', color: '#29BDBC' }}
        >
          {loading || !panel
            ? '로딩 중...'
            : formatMinutes(panel.average_focus_duration)}
        </div>
      </div>
    </div>
  );
};

export default StatPanel;
