import {
  setupSharedCanvas,
  drawToSharedCanvas,
  sharedCanvasToBlob,
} from '@/shared/utils/canvasManager';

const RESIZE_CONFIG = {
  MAX_FILE_SIZE_KB: 100,
  MAX_FILE_SIZE_BYTES: 100 * 1024, // 100KB
  MIN_QUALITY: 0.1,
  MAX_QUALITY: 0.95,
  QUALITY_STEP: 0.05,
  MAX_RESIZE_ATTEMPTS: 10,
} as const;

interface ResizeOptions {
  maxSizeKB?: number;
  initialQuality?: number;
  format?: 'image/jpeg' | 'image/webp';
}

interface ResizeResult {
  blob: Blob;
  sizeKB: number;
  quality: number;
  attempts: number;
}

/**
 * 이미지를 지정된 크기(KB) 이하로 리사이징합니다.
 * 품질을 단계적으로 낮춰가며 목표 크기에 도달할 때까지 반복합니다.
 */
export const resizeImageToTargetSize = async (
  originalBlob: Blob,
  options: ResizeOptions = {},
): Promise<ResizeResult> => {
  const {
    maxSizeKB = RESIZE_CONFIG.MAX_FILE_SIZE_KB,
    initialQuality = RESIZE_CONFIG.MAX_QUALITY,
    format = 'image/webp',
  } = options;

  const maxSizeBytes = maxSizeKB * 1024;

  // 원본 이미지를 Image 객체로 로드
  const image = await loadImageFromBlob(originalBlob);

  // 초기 상태에서 목표 크기보다 작으면 그대로 반환
  if (originalBlob.size <= maxSizeBytes) {
    return {
      blob: originalBlob,
      sizeKB: Math.round(originalBlob.size / 1024),
      quality: 1,
      attempts: 0,
    };
  }

  let currentQuality = initialQuality;
  let attempts = 0;

  // 품질을 단계적으로 낮춰가며 목표 크기에 도달할 때까지 반복
  while (attempts < RESIZE_CONFIG.MAX_RESIZE_ATTEMPTS) {
    const resizedBlob = await createResizedBlob(image, currentQuality, format);
    attempts++;

    if (resizedBlob.size <= maxSizeBytes) {
      return {
        blob: resizedBlob,
        sizeKB: Math.round(resizedBlob.size / 1024),
        quality: currentQuality,
        attempts,
      };
    }

    // 품질 단계적 감소
    currentQuality -= RESIZE_CONFIG.QUALITY_STEP;

    if (currentQuality < RESIZE_CONFIG.MIN_QUALITY) {
      // 최소 품질에도 크기가 맞지 않으면 이미지 크기를 줄임
      return await resizeByDimensions(image, maxSizeBytes, format, attempts);
    }
  }

  throw new Error(
    `이미지 리사이징 실패: ${RESIZE_CONFIG.MAX_RESIZE_ATTEMPTS}회 시도 후에도 목표 크기에 도달하지 못했습니다`,
  );
};

/**
 * Blob에서 Image 객체를 생성합니다.
 */
const loadImageFromBlob = (blob: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(blob);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지 로드 실패'));
    };

    image.src = url;
  });
};

/**
 * Image 객체에서 지정된 품질로 Blob을 생성합니다.
 */
const createResizedBlob = async (
  image: HTMLImageElement,
  quality: number,
  format: string,
): Promise<Blob> => {
  // 공유 Canvas 설정
  setupSharedCanvas(image.width, image.height);

  // 이미지를 Canvas에 그리기
  drawToSharedCanvas(image, 0, 0);

  // Canvas를 Blob으로 변환
  return sharedCanvasToBlob(format, quality);
};

/**
 * 이미지 크기를 줄여서 목표 파일 크기에 맞춥니다.
 */
const resizeByDimensions = async (
  image: HTMLImageElement,
  maxSizeBytes: number,
  format: string,
  previousAttempts: number,
): Promise<ResizeResult> => {
  const DIMENSION_SCALE_FACTOR = 0.8;
  let scale = DIMENSION_SCALE_FACTOR;
  let attempts = previousAttempts;

  while (scale > 0.3 && attempts < RESIZE_CONFIG.MAX_RESIZE_ATTEMPTS * 2) {
    const newWidth = Math.floor(image.width * scale);
    const newHeight = Math.floor(image.height * scale);

    const resizedBlob = await createResizedBlobWithDimensions(
      image,
      newWidth,
      newHeight,
      RESIZE_CONFIG.MIN_QUALITY,
      format,
    );

    attempts++;

    if (resizedBlob.size <= maxSizeBytes) {
      return {
        blob: resizedBlob,
        sizeKB: Math.round(resizedBlob.size / 1024),
        quality: RESIZE_CONFIG.MIN_QUALITY,
        attempts,
      };
    }

    scale -= 0.1;
  }

  throw new Error('이미지를 목표 크기로 압축할 수 없습니다');
};

/**
 * 지정된 크기와 품질로 이미지 Blob을 생성합니다.
 */
const createResizedBlobWithDimensions = async (
  image: HTMLImageElement,
  width: number,
  height: number,
  quality: number,
  format: string,
): Promise<Blob> => {
  // 공유 Canvas 설정
  setupSharedCanvas(width, height);

  // 이미지를 Canvas에 그리기 (크기 조정)
  drawToSharedCanvas(image, 0, 0, width, height);

  // Canvas를 Blob으로 변환
  return sharedCanvasToBlob(format, quality);
};

/**
 * 웹워커 확장성을 위한 인터페이스
 * 추후 웹워커로 이관할 때 동일한 인터페이스 사용 가능
 */
export interface ImageResizerInterface {
  resizeImage: (blob: Blob, options?: ResizeOptions) => Promise<ResizeResult>;
}

export const createImageResizer = (): ImageResizerInterface => ({
  resizeImage: resizeImageToTargetSize,
});
