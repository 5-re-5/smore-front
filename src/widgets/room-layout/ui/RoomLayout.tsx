import { TrackToggle } from '@livekit/components-react';
import { Track } from 'livekit-client';
import VideoGrid from './VideoGrid';

function RoomLayout() {
  return (
    <>
      <VideoGrid />
      {/* Todo: 미디어 바 위젯 만들기 */}
      <TrackToggle source={Track.Source.Microphone} />
      <TrackToggle source={Track.Source.Camera} />
    </>
  );
}

export default RoomLayout;
