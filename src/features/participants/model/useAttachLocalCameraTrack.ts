import { useLocalParticipant } from '@livekit/components-react';
import { useEffect } from 'react';

export function useAttachLocalCameraTrack(
  ref: React.RefObject<HTMLVideoElement | null>,
) {
  const local = useLocalParticipant();
  const cameraTrack = local?.cameraTrack?.track;

  useEffect(() => {
    if (!cameraTrack || !ref.current) return;

    const videoElement = ref.current;

    cameraTrack.attach(videoElement);

    return () => {
      cameraTrack.detach(videoElement);
    };
  }, [cameraTrack, ref]);
}
