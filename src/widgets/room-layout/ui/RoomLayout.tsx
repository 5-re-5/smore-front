import { TrackToggle } from '@livekit/components-react';
import { Track } from 'livekit-client';
import VideoGrid from './VideoGrid';
import { useState } from 'react';
import ChatPanel from '@/widgets/chat/ChatPanel';
import { StopwatchController } from '@/features/stopwatch';
import { WhiteNoiseComponents } from '@/features/white-noise';
import PomodoroSection from './PomodoroSection';

function RoomLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <VideoGrid />

      {/* 채팅 아이콘 버튼 */}
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
          <ChatPanel />
        </div>
      )}

      {/* 기존 미디어바 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
        <TrackToggle source={Track.Source.Microphone} />
        <TrackToggle source={Track.Source.Camera} />
      </div>

      {/* Todo: 미디어 바 위젯 만들기 */}
      <TrackToggle source={Track.Source.Microphone} />
      <TrackToggle source={Track.Source.Camera} />
      <PomodoroSection />
      스톱워치
      <StopwatchController />
      화이트 노이즈
      <WhiteNoiseComponents />

    </>
  );
}

export default RoomLayout;
