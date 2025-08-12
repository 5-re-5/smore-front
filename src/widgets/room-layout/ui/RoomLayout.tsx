import { useState } from 'react';
import { PomodoroSection } from '@/features/pomodoro';
import { StopwatchController } from '@/features/stopwatch';
import { MediaToolbar } from '@/widgets/media-toolbar';
import ChatPanel from '@/features/chat/ui/ChatPanel';
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

      {/* 하단: Toolbar (토글만 담당) */}
      <MediaToolbar
        isChatOpen={isChatOpen}
        onToggleChat={() => setIsChatOpen((v) => !v)}
      />
    </div>
  );
}

export default RoomLayout;
