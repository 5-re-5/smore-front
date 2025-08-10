import { useFaceDetection } from '@/features/face-detection/model/useFaceDetection';
import { useFaceDetectionStore } from '@/features/face-detection/model/useFaceDetectionStore';
import { useAutoCaptureScheduler } from '@/features/focus-capture';
import {
  TrackMutedIndicator,
  useLocalParticipant,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useRef, useMemo } from 'react';
import { useAttachLocalCameraTrack } from '../model/useAttachLocalCameraTrack';
import { useMediaStreamAnalyser } from '@/features/prejoin';

export function LocalVideoTile() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { localParticipant } = useLocalParticipant();
  const { faceDetected, isFaceDetectionEnabled, setFaceDetectionEnabled } =
    useFaceDetectionStore();

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

  const handleToggleFaceDetection = () => {
    setFaceDetectionEnabled(!isFaceDetectionEnabled);
  };

  useFaceDetection(videoRef);

  useAutoCaptureScheduler(videoRef, {
    enabled: true,
  });

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 ${
        isSpeaking
          ? 'border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'
          : 'border-zinc-300'
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover rounded-xl"
        style={{ transform: 'scaleX(-1)' }}
      />
      {!faceDetected && (
        <div className="absolute top-0 left-0 w-full text-center text-red-600 font-bold bg-black/50 px-2 py-1 rounded-b">
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
      {/* 하단 컨트롤 버튼들 */}
      <div className="absolute bottom-2 right-2 flex flex-col gap-2">
        {/* 얼굴 감지 on/off 버튼 */}
        <button
          onClick={handleToggleFaceDetection}
          className="bg-blue-500 text-white p-2 rounded text-xs"
        >
          {isFaceDetectionEnabled ? '얼굴 감지 비활성화' : '얼굴 감지 활성화'}
        </button>
      </div>
    </div>
  );
}
