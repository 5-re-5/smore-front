declare module '@mediapipe/tasks-vision' {
  export interface BaseOptions {
    modelAssetPath: string;
    delegate?: 'CPU' | 'GPU';
  }

  export interface FaceDetectorOptions {
    baseOptions: BaseOptions;
    runningMode: 'IMAGE' | 'VIDEO';
    minDetectionConfidence?: number;
  }

  export interface Detection {
    boundingBox: {
      originX: number;
      originY: number;
      width: number;
      height: number;
    };
    categories: Array<{
      index: number;
      score: number;
      categoryName?: string;
      displayName?: string;
    }>;
  }

  export interface FaceDetectorResult {
    detections: Detection[];
  }

  export class FilesetResolver {
    static forVisionTasks(wasmLoaderPath: string): Promise<FilesetResolver>;
  }

  export class FaceDetector {
    static createFromOptions(
      filesetResolver: FilesetResolver,
      options: FaceDetectorOptions,
    ): Promise<FaceDetector>;

    detectForVideo(
      videoFrame: HTMLVideoElement | HTMLCanvasElement | ImageData,
      timestamp: number,
    ): Promise<FaceDetectorResult>;

    close(): void;
  }
}
