import { useCallback } from 'react';

const CANVAS_CONFIG = {
  MAX_WIDTH: 1280,
  MAX_HEIGHT: 720,
  JPEG_QUALITY: 0.8,
} as const;

export const useCameraCapture = () => {
  const captureImageFromVideo = useCallback(
    (videoElement: HTMLVideoElement): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        if (
          !videoElement ||
          videoElement.videoWidth === 0 ||
          videoElement.videoHeight === 0
        ) {
          reject(new Error('비디오가 로드되지 않았거나 유효하지 않습니다'));
          return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas 컨텍스트를 가져올 수 없습니다'));
          return;
        }

        // 비디오 크기를 기반으로 캔버스 크기 설정
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

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // 비디오 프레임을 캔버스에 그리기
        ctx.drawImage(videoElement, 0, 0, canvasWidth, canvasHeight);

        // 캔버스를 Blob으로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('이미지 Blob 생성에 실패했습니다'));
            }
          },
          'image/webp',
          CANVAS_CONFIG.JPEG_QUALITY,
        );
      });
    },
    [],
  );

  return {
    captureImageFromVideo,
  };
};
