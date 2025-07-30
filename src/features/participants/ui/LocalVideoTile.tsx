import { useRef } from 'react';
import { useAttachLocalCameraTrack } from '../model/useAttachLocalCameraTrack';
import {
  TrackMutedIndicator,
  useLocalParticipant,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useFaceDetection } from '@/features/face-detection/model/useFaceDetection';
import { useFaceDetectionStore } from '@/features/face-detection/model/useFaceDetectionStore';

export function LocalVideoTile() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { localParticipant } = useLocalParticipant();
  const { faceDetected } = useFaceDetectionStore();

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

  useFaceDetection(videoRef);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover rounded-xl"
      />
      {!faceDetected && (
        <div className="absolute top-0 left-0 w-full text-center text-red-600 font-bold bg-transparent">
          얼굴 감지 불가능
        </div>
      )}
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
