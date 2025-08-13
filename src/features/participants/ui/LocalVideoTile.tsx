import { useFaceDetection } from '@/features/face-detection/model/useFaceDetection';
import { useFaceDetectionStore } from '@/features/face-detection/model/useFaceDetectionStore';
import { useAutoCaptureScheduler } from '@/features/focus-capture';
import { useMediaStreamAnalyser } from '@/features/prejoin';
import {
  TrackMutedIndicator,
  useLocalParticipant,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useMemo, useRef } from 'react';
import { useAttachLocalCameraTrack } from '../model/useAttachLocalCameraTrack';

export function LocalVideoTile() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { localParticipant } = useLocalParticipant();
  const { faceDetected } = useFaceDetectionStore();

  useAttachLocalCameraTrack(videoRef);

  const micPub = localParticipant.getTrackPublication(Track.Source.Microphone);
  const camPub = localParticipant.getTrackPublication(Track.Source.Camera);

  const isMicMuted = micPub?.isMuted ?? true;
  const isCamMuted = camPub?.isMuted ?? true;

  // 마이크 트랙에서 MediaStream 추출
  const micStream = useMemo(() => {
    if (!micPub?.track || isMicMuted) return null;
    const mediaStreamTrack = micPub.track.mediaStreamTrack;
    if (!mediaStreamTrack) return null;

    const stream = new MediaStream();
    stream.addTrack(mediaStreamTrack);
    return stream;
  }, [micPub?.track, isMicMuted]);

  // 오디오 레벨 기반 말하기 감지
  const { level } = useMediaStreamAnalyser(micStream);
  const isSpeaking = level > 0.1; // 임계값 0.1

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

  useAutoCaptureScheduler(videoRef, {
    enabled: true,
  });

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 w-full h-full ${
        isSpeaking
          ? 'border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'
          : 'border-zinc-300'
      }`}
    >
      {isCamMuted ? (
        <div className="flex justify-center items-center w-full h-full bg-black rounded-xl">
          <span className="text-xl font-semibold text-white">me</span>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="object-cover w-full h-full rounded-xl"
          style={{ transform: 'scaleX(-1)' }}
        />
      )}
      {!faceDetected && (
        <div className="absolute top-0 left-0 px-2 py-1 w-full font-bold text-center text-red-600 rounded-b bg-black/50">
          얼굴 감지 불가능
        </div>
      )}
      <div className="absolute bottom-2 left-2 text-black text-sm bg-[#AEA7D9] px-2 py-1 rounded">
        me
      </div>
      <div className="flex absolute top-2 right-2 gap-2">
        {isMicMuted && (
          <TrackMutedIndicator
            trackRef={trackRefs.mic}
            className="p-1 bg-white rounded-2xl"
          />
        )}
        {isCamMuted && (
          <TrackMutedIndicator
            trackRef={trackRefs.camera}
            className="p-1 bg-white rounded-2xl"
          />
        )}
      </div>
    </div>
  );
}
