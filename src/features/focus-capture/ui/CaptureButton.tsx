import { submitFocusImage } from '@/entities/focus/api/focusRecordsApi';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { Camera, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { resizeImageToTargetSize } from '../model/imageResize';
import { useCameraCapture } from '../model/useCameraCapture';

interface CaptureButtonProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  className?: string;
}

export function CaptureButton({
  videoRef,
  className = '',
}: CaptureButtonProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCaptureTime, setLastCaptureTime] = useState<string | null>(null);

  const { captureImageFromVideo } = useCameraCapture();
  const getUserId = useAuthStore((state) => state.getUserId);

  const handleCapture = async () => {
    if (!videoRef.current) {
      setError('비디오가 준비되지 않았습니다');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setError('로그인이 필요합니다');
      return;
    }

    setIsCapturing(true);
    setError(null);

    try {
      // 1. 비디오에서 이미지 캡쳐
      const capturedImage = await captureImageFromVideo(videoRef.current);

      // 2. 이미지 리사이징 (100KB 이하로)
      const resizeResult = await resizeImageToTargetSize(capturedImage, {
        maxSizeKB: 100,
        format: 'image/webp',
      });
      console.log(resizeResult);
      // 3. AI 서버로 전송
      await submitFocusImage({
        userId,
        image: resizeResult.blob,
      });

      // 성공 시 마지막 캡쳐 시간 업데이트
      setLastCaptureTime(new Date().toLocaleTimeString('ko-KR'));

      console.log('이미지 캡쳐 및 전송 완료:', {
        originalSize: Math.round(capturedImage.size / 1024) + 'KB',
        compressedSize: resizeResult.sizeKB + 'KB',
        quality: resizeResult.quality,
        attempts: resizeResult.attempts,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '캡쳐 실패';
      setError(errorMessage);
      console.error('이미지 캡쳐 실패:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handleCapture}
        disabled={isCapturing}
        aria-label="집중도 분석용 이미지 캡쳐"
        className={`
          flex items-center justify-center gap-0.5rem p-0.5rem
          bg-green-500 hover:bg-green-600 disabled:bg-gray-400
          text-white rounded-lg transition-colors
          min-w-4rem min-h-2rem
          ${className}
        `}
      >
        {isCapturing ? (
          <>
            <Loader2 className="w-1rem h-1rem animate-spin" />
            <span className="text-xs">분석중...</span>
          </>
        ) : (
          <>
            <Camera className="w-1rem h-1rem" />
            <span className="text-xs">캡쳐</span>
          </>
        )}
      </button>

      {/* 상태 표시 */}
      {error && (
        <div
          className="text-xs text-red-500 bg-red-50 px-0.5rem py-0.25rem rounded"
          role="alert"
        >
          {error}
        </div>
      )}

      {lastCaptureTime && !error && (
        <div className="text-xs text-green-600">{lastCaptureTime} 전송완료</div>
      )}
    </div>
  );
}
