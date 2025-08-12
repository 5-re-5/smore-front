import { useState } from 'react';
import { PomodoroSection } from '@/features/pomodoro';
import { StopwatchController } from '@/features/stopwatch';
import { MediaToolbar } from '@/widgets/media-toolbar';
import ChatPanel from '@/features/chat/ui/ChatPanel';
import VideoGrid from './VideoGrid';

interface RoomLayoutProps {
  isOwner: boolean;
  roomTitle?: string;
}

function RoomLayout({ isOwner, roomTitle = '스터디룸' }: RoomLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">{roomTitle}</h1>
      </div>

      {/* 중간 영역: 도구들 + 카메라 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 비디오 그리드 영역 */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isChatOpen ? 'mr-[360px]' : ''
          }`}
        >
          {/* 상단 도구 영역 */}
          <div className="flex gap-4 p-4 bg-gray-50 border-b">
            {/* 뽀모도로 */}
            <div className="flex-shrink-0">
              <PomodoroSection />
            </div>

            {/* 스톱워치 */}
            <div className="flex-1">
              <StopwatchController />
            </div>
          </div>

          {/* 중앙: Video + (옵션) Chat */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full min-h-0 flex">
              <div className="flex-1 min-h-0 overflow-auto">
                <VideoGrid />
              </div>

              {isChatOpen && (
                // <div className="h-full w-80 shrink-0 border-l border-gray-700 bg-[#1e2230] transition-all duration-200">
                //   <ChatPanel isOpen />
                // </div>
                <div className="relative h-full w-[360px] shrink-0 border-l border-gray-700 bg-[#1e2230] transition-all duration-200">
                  + {/* absolute 박스: 상단 고정, 하단은 툴바 높이만큼 띄움 */}+{' '}
                  <div
                    className="absolute inset-x-0 -top-1"
                    style={{ bottom: 'var(--toolbar-h, 64px)' }}
                  >
                    + <ChatPanel isOpen />+{' '}
                  </div>
                  +{' '}
                </div>
              )}
            </div>
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
