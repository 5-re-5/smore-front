import { useCallback, useRef, useState } from 'react';
import type {
  WorkerMessage,
  WorkerResponse,
} from '@/shared/workers/imageProcessorTypes';

interface ProcessImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

interface ProcessImageResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

interface UseImageProcessorReturn {
  processImage: (
    file: File,
    options?: ProcessImageOptions,
  ) => Promise<ProcessImageResult>;
  progress: number;
  isProcessing: boolean;
  error: string | null;
  cancelProcessing: () => void;
}

export const useImageProcessor = (): UseImageProcessorReturn => {
  const workerRef = useRef<Worker | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const processPromiseRef = useRef<{
    resolve: (value: ProcessImageResult) => void;
    reject: (reason: Error) => void;
  } | null>(null);

  const initWorker = useCallback(() => {
    if (workerRef.current) {
      return workerRef.current;
    }

    try {
      workerRef.current = new Worker(
        new URL('@/shared/workers/imageProcessor.worker.ts', import.meta.url),
        { type: 'module' },
      );

      workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const response = event.data;

        switch (response.type) {
          case 'PROCESS_PROGRESS':
            if (response.progress !== undefined) {
              setProgress(response.progress);
            }
            break;

          case 'PROCESS_SUCCESS':
            if (response.data && processPromiseRef.current) {
              const {
                webpFile,
                fileName,
                originalSize,
                compressedSize,
                width,
                height,
              } = response.data;

              // ArrayBuffer를 File로 변환
              const file = new File([webpFile], fileName, {
                type: 'image/webp',
              });

              processPromiseRef.current.resolve({
                file,
                originalSize,
                compressedSize,
                width,
                height,
              });

              processPromiseRef.current = null;
              setIsProcessing(false);
              setProgress(100);
            }
            break;

          case 'PROCESS_ERROR':
            if (processPromiseRef.current && response.error) {
              processPromiseRef.current.reject(new Error(response.error));
              processPromiseRef.current = null;
            }
            setError(response.error || '알 수 없는 오류가 발생했습니다');
            setIsProcessing(false);
            setProgress(0);
            break;
        }
      };

      workerRef.current.onerror = (error) => {
        console.error('Worker 오류:', error);
        if (processPromiseRef.current) {
          processPromiseRef.current.reject(
            new Error('Worker 오류가 발생했습니다'),
          );
          processPromiseRef.current = null;
        }
        setError('Worker 오류가 발생했습니다');
        setIsProcessing(false);
        setProgress(0);
      };

      return workerRef.current;
    } catch (err) {
      console.error('Worker 초기화 실패:', err);
      throw new Error('WebWorker를 지원하지 않는 브라우저입니다');
    }
  }, []);

  const processImage = useCallback(
    async (
      file: File,
      options: ProcessImageOptions = {},
    ): Promise<ProcessImageResult> => {
      if (isProcessing) {
        throw new Error('이미 이미지를 처리 중입니다');
      }

      setIsProcessing(true);
      setProgress(0);
      setError(null);

      try {
        const worker = initWorker();
        const buffer = await file.arrayBuffer();

        const message: WorkerMessage = {
          type: 'PROCESS_IMAGE',
          buffer,
          fileName: file.name,
          maxWidth: options.maxWidth,
          maxHeight: options.maxHeight,
          quality: options.quality,
        };

        return new Promise<ProcessImageResult>((resolve, reject) => {
          processPromiseRef.current = { resolve, reject };

          // Transferable Objects로 제로카피 전송
          worker.postMessage(message, [buffer]);

          // 타임아웃 설정 (60초)
          setTimeout(() => {
            if (processPromiseRef.current) {
              processPromiseRef.current.reject(
                new Error('처리 시간이 초과되었습니다'),
              );
              processPromiseRef.current = null;
              setIsProcessing(false);
              setProgress(0);
            }
          }, 60000);
        });
      } catch (err) {
        setIsProcessing(false);
        setProgress(0);
        const errorMessage =
          err instanceof Error
            ? err.message
            : '이미지 처리 중 오류가 발생했습니다';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [isProcessing, initWorker],
  );

  const cancelProcessing = useCallback(() => {
    if (workerRef.current && isProcessing) {
      workerRef.current.terminate();
      workerRef.current = null;

      if (processPromiseRef.current) {
        processPromiseRef.current.reject(
          new Error('사용자에 의해 취소되었습니다'),
        );
        processPromiseRef.current = null;
      }

      setIsProcessing(false);
      setProgress(0);
      setError(null);
    }
  }, [isProcessing]);

  // 컴포넌트 언마운트 시 워커 정리
  const cleanup = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    processPromiseRef.current = null;
  }, []);

  // cleanup을 외부에서 사용할 수 있도록 ref에 저장
  const cleanupRef = useRef(cleanup);
  cleanupRef.current = cleanup;

  return {
    processImage,
    progress,
    isProcessing,
    error,
    cancelProcessing,
  };
};
