// features/participants/ui/LocalVideoTile.tsx
import { useRef } from 'react';
import { useAttachLocalCameraTrack } from '../model/useAttachLocalCameraTrack';

export function LocalVideoTile() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useAttachLocalCameraTrack(videoRef);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="w-full h-full object-cover rounded-xl"
    />
  );
}
