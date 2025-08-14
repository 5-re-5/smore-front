import ChatPanel from '@/features/chat/ui/ChatPanel';
import { FocusGauge } from '@/features/focus-gauge';
import { PomodoroSection } from '@/features/pomodoro';
import { StopwatchController } from '@/features/stopwatch';
import { MediaToolbar } from '@/widgets/media-toolbar';
import { useState } from 'react';
import VideoGrid from './VideoGrid';
import { useOwnerExitListener } from '@/features/room';

interface RoomLayoutProps {
  roomIdNumber: number;
  isOwner: boolean;
  isPomodoro: boolean;
  roomTitle?: string;
}

function RoomLayout({
  roomIdNumber,
  isOwner,
  roomTitle = '스터디룸',
  isPomodoro,
}: RoomLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  useOwnerExitListener(roomIdNumber);

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="bg-[#292D32] px-4 py-3">
        <h1 className="text-lg font-semibold text-white">{roomTitle}</h1>
      </div>

      {/* 중간 영역: 도구들 + 카메라 + 채팅 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 중앙: Video + Tools */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Tools: Pomodoro + Stopwatch */}
          <div className="flex justify-center items-center py-4">
            <div className="flex items-center gap-8">
              <FocusGauge />
              {isPomodoro ? <PomodoroSection /> : null}
              <StopwatchController />
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex-1 min-h-0 overflow-auto">
            <VideoGrid />
          </div>
        </div>

        {/* Chat Panel - 오른쪽에 위치 */}
        <div
          className={`relative h-full w-[360px] shrink-0 border-l border-gray-700 bg-[#1e2230] transition-all duration-200 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* absolute 박스: 상단 고정, 하단은 툴바 높이만큼 띄움 */}
          <div
            className="absolute inset-x-0 top-3"
            style={{ bottom: 'var(--toolbar-h, 49px)' }}
          >
            <ChatPanel isOpen={isChatOpen} />
          </div>
        </div>
      </div>
      {/* 하단: Toolbar (토글만 담당) */}
      <MediaToolbar
        isChatOpen={isChatOpen}
        onToggleChat={() => setIsChatOpen((v) => !v)}
        isOwner={isOwner}
      />
    </div>
  );
}

export default RoomLayout;
