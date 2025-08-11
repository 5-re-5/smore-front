import { useEffect, useRef, useCallback, useState } from 'react';
import { useStopwatchStore } from '@/features/stopwatch/model/useStopwatchStore';
import { useFaceDetectionStore } from '@/features/face-detection';
import { useCameraCapture } from './useCameraCapture';
import { resizeImageToTargetSize } from './imageResize';
import { submitFocusImage } from '@/entities/focus/api/focusRecordsApi';
import { useAuthStore } from '@/entities/user/model/useAuthStore';

const AUTO_CAPTURE_CONFIG = {
  INTERVAL_MS: 2000, // 2초마다 캡쳐
} as const;

interface AutoCaptureOptions {
  enabled: boolean;
  intervalMs?: number;
}

interface CaptureStats {
  totalCaptures: number;
  successfulCaptures: number;
  failedCaptures: number;
  isActive: boolean;
}

/**
 * 스톱워치 상태에 따라 자동 이미지 캡쳐를 스케줄링하는 Hook
 */
export const useAutoCaptureScheduler = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options: AutoCaptureOptions = { enabled: false },
) => {
  const { enabled, intervalMs = AUTO_CAPTURE_CONFIG.INTERVAL_MS } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // stats를 useState로 관리해서 리렌더링 트리거
  const [stats, setStats] = useState<CaptureStats>({
    totalCaptures: 0,
    successfulCaptures: 0,
    failedCaptures: 0,
    isActive: false,
  });

  // 스톱워치 상태 구독
  const isStopwatchRunning = useStopwatchStore((state) => state.isRunning);
  // 얼굴 감지 상태 구독
  const isFaceDetectionEnabled = useFaceDetectionStore(
    (state) => state.isFaceDetectionEnabled,
  );

  // 필요한 유틸리티들
  const { captureImageFromVideo } = useCameraCapture();
  const getUserId = useAuthStore((state) => state.getUserId);

  /**
   * 단일 캡쳐 작업 실행
   */
  const executeSingleCapture = useCallback(async (): Promise<void> => {
    if (!videoRef.current || !enabled || !isFaceDetectionEnabled) {
      return;
    }

    const userId = getUserId();
    if (!userId) {
      throw new Error('사용자 인증이 필요합니다');
    }

    try {
      // 1. 이미지 캡쳐
      const capturedImage = await captureImageFromVideo(videoRef.current);

      // 2. 이미지 리사이징
      const resizeResult = await resizeImageToTargetSize(capturedImage, {
        maxSizeKB: 100,
        format: 'image/webp',
      });

      // 3. AI 서버 전송
      await submitFocusImage({
        userId,
        image: resizeResult.blob,
      });

      // 성공 stats 업데이트
      setStats((prev) => ({
        ...prev,
        totalCaptures: prev.totalCaptures + 1,
        successfulCaptures: prev.successfulCaptures + 1,
      }));
    } catch (error) {
      // 실패 stats 업데이트
      setStats((prev) => ({
        ...prev,
        totalCaptures: prev.totalCaptures + 1,
        failedCaptures: prev.failedCaptures + 1,
      }));

      console.warn('자동 캡쳐 실패:', error);
    }
  }, [
    videoRef,
    enabled,
    captureImageFromVideo,
    getUserId,
    isFaceDetectionEnabled,
  ]);

  /**
   * 스케줄러 시작
   */
  const startScheduler = useCallback(() => {
    if (!enabled || intervalRef.current) {
      return;
    }

    intervalRef.current = setInterval(executeSingleCapture, intervalMs);
    setStats((prev) => ({ ...prev, isActive: true }));
  }, [enabled, intervalMs, executeSingleCapture]);

  /**
   * 스케줄러 중지
   */
  const stopScheduler = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setStats((prev) => ({ ...prev, isActive: false }));
  }, []);

  /**
   * 스톱워치 상태 변경에 따른 자동 시작/중지 및 정리
   */
  useEffect(() => {
    if (!enabled || !isFaceDetectionEnabled) {
      stopScheduler();
      return;
    }

    if (isStopwatchRunning) {
      startScheduler();
    } else {
      stopScheduler();
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      stopScheduler();
    };
  }, [
    enabled,
    isStopwatchRunning,
    isFaceDetectionEnabled,
    startScheduler,
    stopScheduler,
  ]);

  return {
    stats,
    isSchedulerActive: stats.isActive,
    startScheduler,
    stopScheduler,
    executeSingleCapture,
  };
};
