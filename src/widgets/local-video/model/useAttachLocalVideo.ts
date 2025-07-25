import type { LocalVideoTrack } from 'livekit-client';
import { useEffect, useRef } from 'react';

function useAttachLocalVideo(track: LocalVideoTrack) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    track.attach(videoElement);

    return () => {
      track.detach();
    };
  }, [track]);
  return videoRef;
}

export default useAttachLocalVideo;
