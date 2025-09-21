import type {
  WorkerMessage,
  WorkerResponse,
  ImageProcessorRequest,
} from './imageProcessorTypes';
import {
  validateImageBuffer,
  createImageBitmapFromBuffer,
  resizeImageBitmap,
  convertToWebP,
  withTimeout,
} from './imageProcessorUtils';

// 워커 스레드에서 메시지 수신 처리
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, buffer, fileName, maxWidth, maxHeight, quality } =
    event.data as ImageProcessorRequest;

  if (type !== 'PROCESS_IMAGE') {
    postErrorMessage('지원하지 않는 작업 타입입니다');
    return;
  }

  try {
    await processImage({
      buffer,
      fileName,
      maxWidth: maxWidth || 1920,
      maxHeight: maxHeight || 1080,
      quality: quality || 0.9,
    });
  } catch (error) {
    console.error('이미지 처리 중 오류:', error);
    postErrorMessage(
      error instanceof Error
        ? error.message
        : '이미지 처리 중 오류가 발생했습니다',
    );
  }
};

const processImage = async ({
  buffer,
  fileName,
  maxWidth,
  maxHeight,
  quality,
}: {
  buffer: ArrayBuffer;
  fileName: string;
  maxWidth: number;
  maxHeight: number;
  quality: number;
}) => {
  // 1. 진행률 업데이트: 검증 시작
  postProgressMessage(10);

  // 2. 파일 검증
  const validationError = await validateImageBuffer(buffer);
  if (validationError) {
    postErrorMessage(validationError);
    return;
  }

  // 3. 진행률 업데이트: ImageBitmap 생성 시작
  postProgressMessage(25);

  // 4. ImageBitmap 생성 (타임아웃 적용)
  const imageBitmap = await withTimeout(
    createImageBitmapFromBuffer(buffer),
    15000, // 15초 타임아웃
  );

  const originalSize = buffer.byteLength;

  // 5. 진행률 업데이트: 리사이징 계산
  postProgressMessage(40);

  // 6. 최적 크기 계산
  const { width: targetWidth, height: targetHeight } = resizeImageBitmap(
    imageBitmap,
    maxWidth,
    maxHeight,
  );

  // 7. 진행률 업데이트: WebP 변환 시작
  postProgressMessage(60);

  // 8. WebP 변환 (타임아웃 적용)
  const webpBuffer = await withTimeout(
    convertToWebP(imageBitmap, targetWidth, targetHeight, quality),
    20000, // 20초 타임아웃
  );

  // 9. 진행률 업데이트: 완료 준비
  postProgressMessage(90);

  // 10. ImageBitmap 정리
  imageBitmap.close();

  // 11. 성공 응답 전송
  const response: WorkerResponse = {
    type: 'PROCESS_SUCCESS',
    data: {
      webpFile: webpBuffer,
      fileName: fileName.replace(/\.[^/.]+$/, '.webp'),
      originalSize,
      compressedSize: webpBuffer.byteLength,
      width: targetWidth,
      height: targetHeight,
      mimeType: 'image/webp',
    },
  };

  // Transferable Objects로 제로카피 전송
  self.postMessage(response, { transfer: [webpBuffer] });

  // 12. 완료
  postProgressMessage(100);
};

const postProgressMessage = (progress: number) => {
  const response: WorkerResponse = {
    type: 'PROCESS_PROGRESS',
    progress,
  };
  self.postMessage(response);
};

const postErrorMessage = (error: string) => {
  const response: WorkerResponse = {
    type: 'PROCESS_ERROR',
    error,
  };
  self.postMessage(response);
};

// 워커 준비 완료 신호
self.postMessage({ type: 'WORKER_READY' });
