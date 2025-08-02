import { useRef, useEffect, useState } from 'react';
import { MediaControls } from './MediaControls';

export const CameraPreview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        currentStream = mediaStream;
        setStream(mediaStream);
        setHasPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Failed to get camera permission:', error);
        setHasPermission(false);
      }
    };

    initCamera();

    // 컴포넌트 언마운트 시 스트림 정리
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); // 의존성 배열 비우기

  // stream이 변경될 때 비디오 엘리먼트에 할당
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const renderContent = () => {
    if (hasPermission === null) {
      return (
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-sm text-gray-300">카메라 권한 요청 중...</p>
        </div>
      );
    }

    if (hasPermission === false) {
      return (
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
          <p className="text-sm text-gray-300">카메라 권한이 필요합니다</p>
          <button
            className="mt-2 text-blue-400 hover:text-blue-300 text-sm underline"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </button>
        </div>
      );
    }

    return (
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
    );
  };

  return (
    <div
      className="bg-gray-900 rounded-lg relative"
      style={{ minHeight: '400px', height: '60vh' }}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg pb-20">
        {renderContent()}
      </div>

      {/* 미디어 컨트롤 하단 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 pb-6">
        <MediaControls stream={stream} />
      </div>
    </div>
  );
};
