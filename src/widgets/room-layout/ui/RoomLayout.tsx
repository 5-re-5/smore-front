import ChatPanel from '@/features/chat/ui/ChatPanel';
import { FocusGauge } from '@/features/focus-gauge';
import { PomodoroSection } from '@/features/pomodoro';
import { useOwnerExitListener } from '@/features/room';
import { StopwatchController } from '@/features/stopwatch';
import { MediaToolbar } from '@/widgets/media-toolbar';
import { useState } from 'react';
import VideoGrid from './VideoGrid';

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
    <div className="flex flex-col h-screen overflow-x-hidden  overflow-y-hidden">
      {/* 헤더 */}
      <div className="bg-[#292D32] px-4 py-3 flex-shrink-0">
        <h1 className="text-lg font-semibold text-white">{roomTitle}</h1>
      </div>

      {/* 중간 영역: 도구들 + 카메라 + 채팅 */}
      <div className="flex flex-1 min-h-0 overflow-x-hidden  overflow-y-hidden">
        {/* 중앙: Video + Tools */}
        <div
          className={`flex flex-col flex-1 min-h-0 ${isChatOpen ? 'translate-x-0' : 'translate-x-45'}`}
        >
          {/* Tools: Pomodoro + Stopwatch */}
          <div className="flex flex-shrink-0 justify-center items-center pt-4">
            <div className="flex gap-8 items-center">
              <FocusGauge />
              {isPomodoro ? <PomodoroSection /> : null}
              <StopwatchController />
            </div>
          </div>

          {/* Video Grid - 스크롤 없이 남은 공간 활용 */}
          <div className="flex-1 min-h-0">
            <VideoGrid />
          </div>
        </div>

        {/* Chat Panel - 오른쪽에 위치 */}
        <div
          className={`relative h-full w-[360px] shrink-0 border-l border-gray-700 bg-[#1e2230] transition-all duration-200 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* absolute 박스: 상단 고정, 하단은 툴바 높이만큼 띄움 */}
          <div
            className="absolute inset-x-0 top-3 h-full"
            style={{ bottom: 'var(--toolbar-h, 49px)' }}
          >
            <ChatPanel isOpen={isChatOpen} />
          </div>
        </div>
      </div>

      {/* 하단: Toolbar (토글만 담당) */}
      <div className="flex-shrink-0">
        <MediaToolbar
          isChatOpen={isChatOpen}
          onToggleChat={() => setIsChatOpen((v) => !v)}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
}

export default RoomLayout;
