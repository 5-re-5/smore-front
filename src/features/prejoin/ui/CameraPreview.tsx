import { useEffect, useRef, useState } from 'react';
import { MediaControls } from './MediaControls';

interface CameraPreviewProps {
  onStreamChange?: (stream: MediaStream | null) => void;
}

export const CameraPreview = ({ onStreamChange }: CameraPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [deviceChangeMessage, setDeviceChangeMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        // 카메라만 먼저 요청
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        // 마이크 권한 추가 시도 (실패해도 카메라는 계속 작동)
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });

          // 오디오 트랙을 기존 스트림에 추가
          const audioTrack = audioStream.getAudioTracks()[0];
          if (audioTrack) {
            videoStream.addTrack(audioTrack);
          }
        } catch (audioError) {
          console.warn(
            'Audio permission denied, continuing with video only:',
            audioError,
          );
        }

        currentStream = videoStream;
        setStream(videoStream);
        setHasPermission(true);
        onStreamChange?.(videoStream);

        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
        }
      } catch (error) {
        console.error('Failed to get camera permission:', error);
        setHasPermission(false);
        onStreamChange?.(null);
      }
    };

    initCamera();

    // 컴포넌트 언마운트 시 스트림 정리
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      onStreamChange?.(null);
    };
  }, [onStreamChange]);

  // stream이 변경될 때 비디오 엘리먼트에 할당
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleDeviceChange = async (
    deviceType: 'videoinput' | 'audioinput' | 'audiooutput',
    deviceId: string,
  ) => {
    try {
      if (deviceType === 'audiooutput') {
        if (videoRef.current && 'setSinkId' in videoRef.current) {
          await (
            videoRef.current as HTMLVideoElement & {
              setSinkId: (sinkId: string) => Promise<void>;
            }
          ).setSinkId(deviceId);
          setDeviceChangeMessage('스피커가 변경되었습니다');
          setTimeout(() => setDeviceChangeMessage(null), 2000);
        }
        return;
      }

      if (!stream) return;

      if (deviceType === 'audioinput') {
        const newAudioStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: deviceId } },
        });

        const newAudioTrack = newAudioStream.getAudioTracks()[0];

        const oldAudioTrack = stream.getAudioTracks()[0];
        if (oldAudioTrack) {
          stream.removeTrack(oldAudioTrack);
          oldAudioTrack.stop();
        }

        stream.addTrack(newAudioTrack);

        newAudioStream.getTracks().forEach((track) => {
          if (track !== newAudioTrack) track.stop();
        });

        setDeviceChangeMessage('마이크가 변경되었습니다');
        setTimeout(() => setDeviceChangeMessage(null), 2000);
        return;
      }

      if (deviceType === 'videoinput') {
        const currentAudioTrack = stream.getAudioTracks()[0];

        const constraints: MediaStreamConstraints = {
          video: { deviceId: { exact: deviceId } },
          audio: currentAudioTrack
            ? {
                deviceId: {
                  exact: currentAudioTrack.getSettings().deviceId || '',
                },
              }
            : false,
        };

        const newStream =
          await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }

        // 기존 스트림 정지
        stream.getTracks().forEach((track) => track.stop());
        setStream(newStream);
        onStreamChange?.(newStream);

        setDeviceChangeMessage('카메라가 변경되었습니다');
        setTimeout(() => setDeviceChangeMessage(null), 2000);
      }
    } catch (error) {
      console.error('Failed to change device:', error);
    }
  };

  const renderLoadingState = () => (
    <div className="text-center text-white">
      <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
      <p className="text-sm text-gray-300">카메라 권한 요청 중...</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center text-white">
      <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="text-sm text-gray-300">카메라 접근이 차단되었습니다</p>
      <div className="mt-3 text-xs text-gray-400 space-y-2">
        <p>브라우저 주소창의 🔒 아이콘을 클릭하여</p>
        <p>카메라 권한을 허용한 후 새로고침해주세요</p>
        <button
          className="mt-2 text-blue-400 hover:text-blue-300 text-sm underline"
          onClick={() => window.location.reload()}
        >
          페이지 새로고침
        </button>
      </div>
    </div>
  );

  const renderVideoStream = () => (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover transform scale-x-[-1]"
    />
  );

  const renderContent = () => {
    if (hasPermission === null) return renderLoadingState();
    if (hasPermission === false) return renderErrorState();
    return renderVideoStream();
  };

  return (
    <div className="rounded-lg relative w-full h-100">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
        {renderContent()}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 rounded-b-lg">
        <MediaControls stream={stream} onDeviceChange={handleDeviceChange} />
      </div>

      {/* 기기 변경 알림 */}
      {deviceChangeMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {deviceChangeMessage}
        </div>
      )}
    </div>
  );
};
