import { useCallback } from 'react';
import {
  setupSharedCanvas,
  drawToSharedCanvas,
  sharedCanvasToBlob,
} from '@/shared/utils/canvasManager';

const CANVAS_CONFIG = {
  MAX_WIDTH: 1280,
  MAX_HEIGHT: 720,
  WEBP_QUALITY: 0.8,
} as const;

export const useCameraCapture = () => {
  const captureImageFromVideo = useCallback(
    async (videoElement: HTMLVideoElement): Promise<Blob> => {
      if (
        !videoElement ||
        videoElement.videoWidth === 0 ||
        videoElement.videoHeight === 0
      ) {
        throw new Error('비디오가 로드되지 않았거나 유효하지 않습니다');
      }

      try {
        // 비디오 크기를 기반으로 캔버스 크기 계산
        const { videoWidth, videoHeight } = videoElement;
        const aspectRatio = videoWidth / videoHeight;

        // 최대 크기 제한
        let canvasWidth = videoWidth;
        let canvasHeight = videoHeight;

        if (canvasWidth > CANVAS_CONFIG.MAX_WIDTH) {
          canvasWidth = CANVAS_CONFIG.MAX_WIDTH;
          canvasHeight = canvasWidth / aspectRatio;
        }

        if (canvasHeight > CANVAS_CONFIG.MAX_HEIGHT) {
          canvasHeight = CANVAS_CONFIG.MAX_HEIGHT;
          canvasWidth = canvasHeight * aspectRatio;
        }

        // 공유 Canvas 설정
        setupSharedCanvas(canvasWidth, canvasHeight);

        // 비디오 프레임을 캔버스에 그리기
        drawToSharedCanvas(videoElement, 0, 0, canvasWidth, canvasHeight);

        // 캔버스를 Blob으로 변환
        return await sharedCanvasToBlob(
          'image/webp',
          CANVAS_CONFIG.WEBP_QUALITY,
        );
      } catch (error) {
        throw error instanceof Error ? error : new Error('이미지 캡쳐 실패');
      }
    },
    [],
  );

  return {
    captureImageFromVideo,
  };
};
