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
  const [isMounted, setIsMounted] = useState(true);

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

      return faceDetector;
    } catch (error) {
      console.error('Face detector initialization failed:', error);
      throw error;
    }
  };

  const detectFace = useCallback(
    async (faceDetector: FaceDetector) => {
      if (!videoRef.current || !isMounted) return;

      const videoElement = videoRef.current;
      try {
        const timestamp = performance.now();
        const detections = await faceDetector.detectForVideo(
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
    },
    [videoRef, isMounted, setFaceDetected, isRunning, start, pause],
  );

  const startFaceDetection = useCallback(async () => {
    if (!isMounted) return;

    try {
      const faceDetector = await initializeFaceDetector();
      faceDetectionInterval.current = setInterval(
        () => detectFace(faceDetector),
        1000,
      );
    } catch (error) {
      console.error('Error initializing face detector:', error);
    }
  }, [isMounted, detectFace]);

  useEffect(() => {
    setIsMounted(true);

    if (isFaceDetectionEnabled && isRunning) {
      startFaceDetection();
      return;
    }

    if (faceDetectionInterval.current) {
      clearInterval(faceDetectionInterval.current);
    }

    return () => {
      setIsMounted(false);
      if (faceDetectionInterval.current) {
        clearInterval(faceDetectionInterval.current);
      }
    };
  }, [isRunning, isFaceDetectionEnabled, videoRef, startFaceDetection]);
};
