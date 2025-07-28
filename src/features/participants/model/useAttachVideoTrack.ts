import { useEffect } from 'react';
import type { Track } from 'livekit-client';

export function useAttachVideoTrack(
  ref: React.RefObject<HTMLVideoElement | null>,
  track: Track | null | undefined,
) {
  useEffect(() => {
    const videoElement = ref.current;
    if (!track || !videoElement || track.kind !== 'video') return;

    try {
      track.attach(videoElement);
    } catch (e) {
      console.warn('Attach video track failed:', e);
    }

    return () => {
      try {
        track.detach(videoElement);
      } catch (e) {
        console.warn('Detach video track failed:', e);
      }
    };
  }, [track]);
}
