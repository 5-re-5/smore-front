import { useEffect, useRef } from 'react';
import { FilesetResolver, FaceDetector } from '@mediapipe/tasks-vision';
import { useStopwatchStore } from '@/features/stopwatch';
import { useFaceDetectionStore } from './useFaceDetectionStore';

export const useFaceDetection = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
) => {
  const { start, pause, isRunning } = useStopwatchStore();
  const { setFaceDetected } = useFaceDetectionStore();

  const faceDetectionInterval = useRef<NodeJS.Timeout | null>(null);
  const faceDetectedTime = useRef<number>(0);

  // Mediapipe 초기화
  const initializeFaceDetector = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
    );

    const faceDetector = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: '/models/blaze_face_short_range.tflite',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      minDetectionConfidence: 0.6,
    });

    return faceDetector;
  };

  const detectFace = async (faceDetector: FaceDetector) => {
    if (!videoRef.current) return;

    const videoElement = videoRef.current;
    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      console.error('Video element is not ready.');
      return;
    }

    const timestamp = performance.now();
    const detections = await faceDetector.detectForVideo(
      videoElement,
      timestamp,
    );

    const currentTime = performance.now(); // currentTime을 여기서 계산합니다.

    // 얼굴이 감지되었을 때
    if (detections.detections.length > 0) {
      setFaceDetected(true);
      faceDetectedTime.current = currentTime;
      console.log('얼굴 감지');
      if (!isRunning) start(); // 얼굴 감지되면 start
      return;
    }

    // 얼굴이 감지되지 않았을 때
    console.log('노얼굴');
    setFaceDetected(false);
    if (currentTime - faceDetectedTime.current > 5000) {
      pause();
      if (faceDetectionInterval.current) {
        clearInterval(faceDetectionInterval.current);
      }
    }
  };

  // interval로 얼굴 감지 주기 설정
  const startFaceDetection = async () => {
    const faceDetector = await initializeFaceDetector();
    faceDetectionInterval.current = setInterval(
      () => detectFace(faceDetector),
      1000,
    );
  };

  // 스톱워치 제어에 따른 얼굴 감지 동작 변경
  useEffect(() => {
    if (isRunning) {
      startFaceDetection(); // 스톱워치가 실행되면 얼굴 감지 시작
      return;
    }

    if (!faceDetectionInterval.current) return;

    clearInterval(faceDetectionInterval.current);

    return () => {
      if (!faceDetectionInterval.current) return;

      clearInterval(faceDetectionInterval.current);
    };
  }, [isRunning, videoRef]); // `isRunning`에 따라 얼굴 감지 시작/중지
};
