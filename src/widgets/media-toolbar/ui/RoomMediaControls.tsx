import { WhiteNoiseComponents } from '@/features/white-noise';
import { Button } from '@/shared/ui';
import { Mic, MicOff, Video, VideoOff, Volume2, VolumeOff } from 'lucide-react';
import { useRoomMediaToggle } from '../model/useRoomMediaToggle';
import { getMediaButtonStyle } from './styles';

function RoomMediaControls() {
  const micToggle = useRoomMediaToggle({
    mediaType: 'microphone',
    onError: (error) => console.error('Microphone toggle error:', error),
  });

  const cameraToggle = useRoomMediaToggle({
    mediaType: 'camera',
    onError: (error) => console.error('Camera toggle error:', error),
  });

  const speakerToggle = useRoomMediaToggle({
    mediaType: 'speaker',
    onError: (error) => console.error('Speaker toggle error:', error),
  });

  return (
    <div className="flex items-center h-10 space-x-4">
      {/* 화이트 노이즈 토글 */}
      <WhiteNoiseComponents />

      {/* 마이크 토글 */}
      <Button
        onClick={micToggle.toggle}
        disabled={micToggle.isPending}
        className={getMediaButtonStyle(
          micToggle.isEnabled,
          micToggle.isPending,
        )}
        aria-label={`마이크 ${micToggle.isEnabled ? '끄기' : '켜기'}`}
      >
        {micToggle.isEnabled ? (
          <Mic className="w-1.25rem h-1.25rem " />
        ) : (
          <MicOff className="w-1.25rem h-1.25rem" />
        )}
      </Button>

      {/* 카메라 토글 */}
      <Button
        onClick={cameraToggle.toggle}
        disabled={cameraToggle.isPending}
        className={getMediaButtonStyle(
          cameraToggle.isEnabled,
          cameraToggle.isPending,
        )}
        aria-label={`카메라 ${cameraToggle.isEnabled ? '끄기' : '켜기'}`}
      >
        {cameraToggle.isEnabled ? (
          <Video className="w-1.25rem h-1.25rem " />
        ) : (
          <VideoOff className="w-1.25rem h-1.25rem " />
        )}
      </Button>

      {/* 스피커 토글 */}
      <Button
        onClick={speakerToggle.toggle}
        disabled={speakerToggle.isPending}
        className={getMediaButtonStyle(
          speakerToggle.isEnabled,
          speakerToggle.isPending,
        )}
        aria-label={`스피커 ${speakerToggle.isEnabled ? '끄기' : '켜기'}`}
      >
        {speakerToggle.isEnabled ? (
          <Volume2 className="w-1.25rem h-1.25rem " />
        ) : (
          <VolumeOff className="w-1.25rem h-1.25rem " />
        )}
      </Button>
    </div>
  );
}

export default RoomMediaControls;
