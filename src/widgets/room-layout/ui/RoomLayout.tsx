import { TrackToggle } from '@livekit/components-react';
import { Track } from 'livekit-client';
import VideoGrid from './VideoGrid';
import { StopwatchController } from '@/features/stopwatch';
import { WhiteNoiseComponents } from '@/features/white-noise';

function RoomLayout() {
  return (
    <>
      <VideoGrid />
      {/* Todo: 미디어 바 위젯 만들기 */}
      <TrackToggle source={Track.Source.Microphone} />
      <TrackToggle source={Track.Source.Camera} />
      스톱워치
      <StopwatchController />
      화이트 노이즈
      <WhiteNoiseComponents />
    </>
  );
}

export default RoomLayout;
