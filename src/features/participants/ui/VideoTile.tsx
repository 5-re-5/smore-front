import type { Track } from 'livekit-client';
import { useRef } from 'react';
import { useAttachVideoTrack } from '../model/useAttachVideoTrack';

interface VideoTileProps {
  participantTrack: {
    track: Track;
    identity: string;
    isLocal: boolean;
    isSpeaking: boolean;
  };
}

function VideoTile({ participantTrack }: VideoTileProps) {
  const { track, identity, isLocal, isSpeaking } = participantTrack;
  const videoRef = useRef<HTMLVideoElement>(null);
  useAttachVideoTrack(videoRef, track);

  return (
    <div
      className={`relative rounded-xl border p-2 transition-all duration-300 ${
        isSpeaking
          ? 'border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'
          : 'border-zinc-300'
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted={isLocal}
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
        {identity} {isLocal && '(You)'}
      </div>
    </div>
  );
}

export default VideoTile;
