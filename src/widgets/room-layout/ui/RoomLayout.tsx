import ChatPanel from '@/features/chat/ui/ChatPanel';
import { PomodoroSection } from '@/features/pomodoro';
import { StopwatchController } from '@/features/stopwatch';
import { MediaToolbar } from '@/widgets/media-toolbar';
import { useState } from 'react';
import VideoGrid from './VideoGrid';

function RoomLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <MediaToolbar />
      <div className="pb-16">
        <VideoGrid />
      </div>
      <StopwatchController />
      <PomodoroSection />
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
    </>
  );
}

export default RoomLayout;
