const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const PROCESSING_TIMEOUT = 30000; // 30초

export const validateImageBuffer = async (
  buffer: ArrayBuffer,
): Promise<string | null> => {
  if (buffer.byteLength === 0) {
    return '파일이 비어있습니다';
  }

  if (buffer.byteLength > MAX_FILE_SIZE) {
    return '파일 크기가 100MB를 초과합니다';
  }

  // MIME 타입 검증을 위한 파일 시그니처 확인
  const uint8Array = new Uint8Array(buffer);
  const mimeType = getMimeTypeFromBuffer(uint8Array);

  if (!mimeType || !ACCEPTED_IMAGE_TYPES.includes(mimeType)) {
    return 'jpg, jpeg, png, webp 파일만 업로드 가능합니다';
  }

  return null;
};

export const getMimeTypeFromBuffer = (
  uint8Array: Uint8Array,
): string | null => {
  const bytes = uint8Array.slice(0, 12);

  // JPEG
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return 'image/png';
  }

  // WebP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }

  return null;
};

export const createImageBitmapFromBuffer = async (
  buffer: ArrayBuffer,
): Promise<ImageBitmap> => {
  const blob = new Blob([buffer]);
  return createImageBitmap(blob);
};

export const resizeImageBitmap = (
  imageBitmap: ImageBitmap,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
): { width: number; height: number } => {
  const { width: originalWidth, height: originalHeight } = imageBitmap;

  if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
    return { width: originalWidth, height: originalHeight };
  }

  const aspectRatio = originalWidth / originalHeight;

  let newWidth = originalWidth;
  let newHeight = originalHeight;

  if (originalWidth > maxWidth) {
    newWidth = maxWidth;
    newHeight = newWidth / aspectRatio;
  }

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  }

  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight),
  };
};

export const convertToWebP = async (
  imageBitmap: ImageBitmap,
  targetWidth: number,
  targetHeight: number,
  quality: number = 0.9,
): Promise<ArrayBuffer> => {
  // OffscreenCanvas 사용으로 메인 스레드 블로킹 방지
  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context를 생성할 수 없습니다');
  }

  // 이미지를 캔버스에 그리기
  ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

  // WebP로 변환
  const blob = await canvas.convertToBlob({
    type: 'image/webp',
    quality,
  });

  return blob.arrayBuffer();
};

export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = PROCESSING_TIMEOUT,
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('처리 시간이 초과되었습니다')),
        timeoutMs,
      ),
    ),
  ]);
};
