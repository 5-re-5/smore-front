import { useEffect, useRef, useState, useCallback } from 'react';
import { FilesetResolver, FaceDetector } from '@mediapipe/tasks-vision';
import { useStopwatchStore } from '@/features/stopwatch';
import { useFaceDetectionStore } from './useFaceDetectionStore';

export const useFaceDetection = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
) => {
  const { start, pause, isRunning } = useStopwatchStore();
  const { setFaceDetected, isFaceDetectionEnabled } = useFaceDetectionStore();

  const faceDetectionInterval = useRef<NodeJS.Timeout | null>(null);
  const faceDetectedTime = useRef<number>(0);
  const faceDetectorRef = useRef<FaceDetector | null>(null);
  const [isMounted, setIsMounted] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeFaceDetector = async () => {
    try {
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

      faceDetectorRef.current = faceDetector;
      setIsInitialized(true);

      return faceDetector;
    } catch (error) {
      console.error('Face detector initialization failed:', error);
      throw error;
    }
  };

  const detectFace = useCallback(async () => {
    if (!videoRef.current || !isMounted || !faceDetectorRef.current) return;

    const videoElement = videoRef.current;
    try {
      const timestamp = performance.now();
      const detections = await faceDetectorRef.current.detectForVideo(
        videoElement,
        timestamp,
      );

      const currentTime = performance.now();

      if (detections.detections.length > 0) {
        setFaceDetected(true);
        faceDetectedTime.current = currentTime;
        if (!isRunning) start();
        return;
      }

      setFaceDetected(false);
      if (currentTime - faceDetectedTime.current > 5000) {
        pause();
        if (faceDetectionInterval.current) {
          clearInterval(faceDetectionInterval.current);
        }
      }
    } catch (error) {
      console.error('Error during face detection:', error);
    }
  }, [videoRef, isMounted, setFaceDetected, isRunning, start, pause]);

  const startDetectionInterval = useCallback(() => {
    if (
      !isMounted ||
      !faceDetectorRef.current ||
      faceDetectionInterval.current
    ) {
      return;
    }

    faceDetectionInterval.current = setInterval(detectFace, 1000);
  }, [isMounted, detectFace]);

  const stopDetectionInterval = useCallback(() => {
    if (faceDetectionInterval.current) {
      clearInterval(faceDetectionInterval.current);
      faceDetectionInterval.current = null;
    }
  }, []);

  // FaceDetector 초기화
  useEffect(() => {
    setIsMounted(true);

    if (!isInitialized && !faceDetectorRef.current) {
      initializeFaceDetector().catch((error) => {
        console.error('FaceDetector 초기화 실패:', error);
      });
    }

    return () => {
      setIsMounted(false);
      stopDetectionInterval();
    };
  }, []);

  // isRunning과 isFaceDetectionEnabled 상태에 따라 interval만 제어
  useEffect(() => {
    if (!isInitialized || !isFaceDetectionEnabled) {
      stopDetectionInterval();
      return;
    }

    if (isRunning) {
      startDetectionInterval();
    } else {
      stopDetectionInterval();
    }
  }, [
    isRunning,
    isFaceDetectionEnabled,
    isInitialized,
    startDetectionInterval,
    stopDetectionInterval,
  ]);
};
