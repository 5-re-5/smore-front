import { PomodoroSection } from '@/features/pomodoro';
import { StopwatchController } from '@/features/stopwatch';
import { MediaToolbar } from '@/widgets/media-toolbar';
import VideoGrid from './VideoGrid';

function RoomLayout() {
  return (
    <div className="h-full flex flex-col">
      {/* 상단: 뽀모도로 + 스톱워치 */}
      <div className="flex justify-between items-start p-4 bg-gray-100 border-b">
        <div className="w-1/4 pr-2">
          <PomodoroSection />
        </div>
        <div className="w-3/4 pl-2">
          <StopwatchController />
        </div>
      </div>

      {/* 중앙: 비디오 그리드 */}
      <div className="flex-1 overflow-hidden">
        <VideoGrid />
      </div>

      {/* 하단: MediaToolbar (채팅 포함) */}
      <MediaToolbar />
    </div>
  );
}

export default RoomLayout;
