import { useEffect, useRef } from 'react';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import { useStopwatchStore } from '@/features/stopwatch';

export const useFaceDetection = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
) => {
  const { start, pause, isRunning } = useStopwatchStore();
  const animationFrameId = useRef<number | null>(null);

  // 얼굴 감지기 초기화 (한 번만 실행)
  const initializeFaceDetector = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
    );

    // 얼굴 감지기 설정
    const faceDetector = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: '/models/blaze_face_short_range.tflite', // 로컬 경로를 사용할 경우
        delegate: 'GPU',
      },
      runningMode: 'VIDEO', // 비디오 모드 설정
    });

    return faceDetector;
  };

  useEffect(() => {
    if (!isRunning) {
      // isRunning이 false이면 얼굴 감지 중단
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return; // isRunning이 false일 때는 얼굴 감지 시작하지 않음
    }

    const startFaceDetection = async () => {
      const faceDetector = await initializeFaceDetector();

      if (!videoRef.current) return;

      let lastDetectionTime = 0;
      let faceNotDetectedFor = 0;

      // 비디오에서 얼굴을 감지하는 함수
      const captureFrame = () => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
          console.error('Video element is not ready.');
          return;
        }

        const timestamp = performance.now();
        const detections = faceDetector.detectForVideo(
          videoElement,
          timestamp,
        ).detections;

        // 얼굴이 감지된 경우
        if (detections.length > 0) {
          console.log('얼굴 있어');
          start(); // 얼굴이 있으면 start 호출
          lastDetectionTime = timestamp;
          faceNotDetectedFor = 0; // 얼굴이 감지되었으므로 카운트 리셋
        } else {
          console.log('얼굴 없어');
          const currentTime = performance.now();

          // 얼굴이 5초 동안 감지되지 않으면 pause
          if (currentTime - lastDetectionTime > 5000) {
            if (faceNotDetectedFor < 5) {
              faceNotDetectedFor += 1;
            } else {
              pause(); // 얼굴이 없으면 pause 호출
            }
          }
        }

        // requestAnimationFrame ID를 저장하여 나중에 취소할 수 있게 함
        animationFrameId.current = requestAnimationFrame(captureFrame);
      };

      animationFrameId.current = requestAnimationFrame(captureFrame); // 첫 번째 프레임 캡처 시작
    };

    startFaceDetection();

    // 컴포넌트 언마운트 시 얼굴 감지 작업을 중단합니다.
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [videoRef, isRunning, start, pause]); // `isRunning` 상태가 변경될 때마다 실행
};
