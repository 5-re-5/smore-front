import { VideoOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useVideoState } from '../model/useMediaControlStore';
import { MediaControls } from './MediaControls';

export const CameraPreview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // audioElement 참조 안정화 - 한 번만 설정하여 불필요한 리렌더 방지
  const [audioElement, setAudioElement] = useState<HTMLVideoElement | null>(
    null,
  );
  const [deviceChangeMessage, setDeviceChangeMessage] = useState<string | null>(
    null,
  );

  // 전역 상태에서 비디오 스트림 가져오기
  const videoState = useVideoState();

  // 마운트 시 한 번만 audioElement 설정하여 참조 안정화
  useEffect(() => {
    if (videoRef.current && !audioElement) {
      setAudioElement(videoRef.current);
    }
  }, [audioElement]);

  // 전역 상태의 비디오 스트림을 비디오 엘리먼트에 연결
  useEffect(() => {
    if (videoState.stream && videoRef.current) {
      videoRef.current.srcObject = videoState.stream;
    } else if (!videoState.stream && videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [videoState.stream]);

  // 전역 상태를 통해 스트림 관리가 이루어짐

  const handleDeviceChange = async (
    deviceType: 'videoinput' | 'audioinput' | 'audiooutput',
    deviceId: string,
  ) => {
    if (deviceType === 'audiooutput') {
      try {
        if (videoRef.current && 'setSinkId' in videoRef.current) {
          await (
            videoRef.current as HTMLVideoElement & {
              setSinkId: (sinkId: string) => Promise<void>;
            }
          ).setSinkId(deviceId);
          setDeviceChangeMessage('스피커가 변경되었습니다');
          setTimeout(() => setDeviceChangeMessage(null), 2000);
        }
      } catch (error) {
        console.error('Failed to change speaker:', error);
      }
      return;
    }

    // 비디오/오디오 디바이스 변경 메시지 표시
    const deviceName = deviceType === 'videoinput' ? '카메라' : '마이크';
    setDeviceChangeMessage(`${deviceName}가 변경되었습니다`);
    setTimeout(() => setDeviceChangeMessage(null), 2000);
  };

  const renderVideoOffState = () => (
    <div className="text-center text-white">
      <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
        <VideoOff color="white" />
      </div>
      <p className="text-sm text-gray-300">카메라가 꺼져있습니다</p>
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
    if (videoState.stream && videoState.isEnabled) {
      return renderVideoStream();
    }
    return renderVideoOffState();
  };

  return (
    <div className="rounded-lg relative w-full h-100">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
        {renderContent()}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 rounded-b-lg">
        <MediaControls
          onDeviceChange={handleDeviceChange}
          audioElement={audioElement}
        />
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
