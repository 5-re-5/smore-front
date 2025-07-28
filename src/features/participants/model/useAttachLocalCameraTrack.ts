import { useLocalParticipant } from '@livekit/components-react';
import { useEffect } from 'react';

export function useAttachLocalCameraTrack(
  ref: React.RefObject<HTMLVideoElement | null>,
) {
  const local = useLocalParticipant();
  const cameraTrack = local?.cameraTrack?.track;

  useEffect(() => {
    const videoElement = ref.current;
    if (!cameraTrack || !videoElement) return;

    cameraTrack.attach(videoElement);

    return () => {
      try {
        cameraTrack.detach(videoElement);
      } catch (e) {
        console.warn('Failed to detach camera track:', e);
      }
    };
  }, [cameraTrack, ref]);
}
