// features/participants/ui/LocalVideoTile.tsx
import { useRef } from 'react';
import { useAttachLocalCameraTrack } from '../model/useAttachLocalCameraTrack';
import {
  TrackMutedIndicator,
  useLocalParticipant,
} from '@livekit/components-react';
import { Track } from 'livekit-client';

export function LocalVideoTile() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { localParticipant } = useLocalParticipant();

  useAttachLocalCameraTrack(videoRef);

  const micPub = localParticipant.getTrackPublication(Track.Source.Microphone);
  const camPub = localParticipant.getTrackPublication(Track.Source.Camera);

  const isMicMuted = micPub?.isMuted ?? true;
  const isCamMuted = camPub?.isMuted ?? true;

  const trackRefs = {
    camera: {
      participant: localParticipant,
      source: Track.Source.Camera,
    },
    mic: {
      participant: localParticipant,
      source: Track.Source.Microphone,
    },
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover rounded-xl"
      />
      <div className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
        me
      </div>
      <div className="absolute top-2 right-2 flex gap-2">
        {isMicMuted && (
          <TrackMutedIndicator
            trackRef={trackRefs.mic}
            className=" bg-white rounded-2xl p-1"
          />
        )}
        {isCamMuted && (
          <TrackMutedIndicator
            trackRef={trackRefs.camera}
            className=" bg-white rounded-2xl p-1"
          />
        )}
      </div>
    </div>
  );
}
