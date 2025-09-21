export interface ImageProcessorRequest {
  type: 'PROCESS_IMAGE';
  buffer: ArrayBuffer;
  fileName: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface ImageProcessorResponse {
  type: 'PROCESS_SUCCESS' | 'PROCESS_ERROR' | 'PROCESS_PROGRESS';
  data?: {
    webpFile: ArrayBuffer;
    fileName: string;
    originalSize: number;
    compressedSize: number;
    width: number;
    height: number;
    mimeType: string;
  };
  progress?: number;
  error?: string;
}

export interface ImageValidationError {
  type: 'VALIDATION_ERROR';
  message: string;
}

export type WorkerMessage = ImageProcessorRequest;
export type WorkerResponse = ImageProcessorResponse | ImageValidationError;
