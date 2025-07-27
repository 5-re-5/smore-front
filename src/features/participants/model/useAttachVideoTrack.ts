import { useEffect } from 'react';
import type { Track } from 'livekit-client';

export function useAttachVideoTrack(
  ref: React.RefObject<HTMLVideoElement | null>,
  track: Track,
) {
  useEffect(() => {
    if (!ref.current || !track || track.kind !== 'video') return;

    const videoElement = ref.current;
    track.attach(videoElement);

    return () => {
      track.detach(videoElement);
    };
  }, [track, ref]);
}
