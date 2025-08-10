import ChatPanel from '@/features/chat/ui/ChatPanel';
import { PomodoroSection } from '@/features/pomodoro';
import { StopwatchController } from '@/features/stopwatch';
import { MediaToolbar } from '@/widgets/media-toolbar';
import { useState } from 'react';
import VideoGrid from './VideoGrid';

function RoomLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false);

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

      {/* 하단: MediaToolbar */}
      <MediaToolbar />

      {/* 하단 고정 요소들 */}
      <div className="absolute bottom-4 right-4 z-50">
        <button
          onClick={() => setIsChatOpen((prev) => !prev)}
          className="p-2 rounded-full bg-white shadow"
        >
          💬
        </button>
      </div>

      {/* 채팅 패널 */}
      {isChatOpen && (
        <div className="absolute right-0 top-0 h-full z-40">
          <ChatPanel isOpen={isChatOpen} />
        </div>
      )}
    </div>
  );
}

export default RoomLayout;
