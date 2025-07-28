import type { LocalVideoTrack } from 'livekit-client';
import { useEffect, useRef } from 'react';

function useAttachLocalVideo(track: LocalVideoTrack) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!track || !videoElement) return;

    track.attach(videoElement);

    return () => {
      try {
        track.detach(videoElement);
      } catch (e) {
        console.warn('Failed to detach video track:', e);
      }
    };
  }, [track]);

  return videoRef;
}

export default useAttachLocalVideo;
