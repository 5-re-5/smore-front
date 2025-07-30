import { useState, useRef } from 'react';
import { useFaceDetectionStore } from '@/features/face-detection/model/useFaceDetectionStore';
import { useFaceDetection } from '@/features/face-detection/model/useFaceDetection';
import { useAttachLocalCameraTrack } from '../model/useAttachLocalCameraTrack';
import {
  TrackMutedIndicator,
  useLocalParticipant,
} from '@livekit/components-react';
import { Track } from 'livekit-client';

export function LocalVideoTile() {
  const [isFaceDetectionEnabled, setIsFaceDetectionEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  const handleToggleFaceDetection = () => {
    setIsFaceDetectionEnabled((prev) => !prev);
  };

  useFaceDetection(videoRef, isFaceDetectionEnabled);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover rounded-xl"
        style={{ transform: 'scaleX(-1)' }}
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
      {/* 얼굴 감지 on/off 버튼 */}
      <button
        onClick={handleToggleFaceDetection}
        className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded"
      >
        {isFaceDetectionEnabled ? '얼굴 감지 비활성화' : '얼굴 감지 활성화'}
      </button>
    </div>
  );
}
