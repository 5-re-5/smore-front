/**
 * 전역 Canvas 싱글톤 매니저
 * 앱 전체에서 하나의 Canvas 인스턴스를 공유하여 메모리 효율성을 극대화합니다.
 */
class CanvasManager {
  private static instance: CanvasManager | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;

  private constructor() {}

  /**
   * CanvasManager 싱글톤 인스턴스를 반환합니다.
   */
  static getInstance(): CanvasManager {
    if (!CanvasManager.instance) {
      CanvasManager.instance = new CanvasManager();
    }
    return CanvasManager.instance;
  }

  /**
   * Canvas 인스턴스를 반환합니다. 없으면 생성합니다.
   */
  getCanvas(): HTMLCanvasElement {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
    }
    return this.canvas;
  }

  /**
   * Canvas 2D 컨텍스트를 반환합니다.
   */
  getContext(): CanvasRenderingContext2D {
    if (!this.context) {
      const canvas = this.getCanvas();
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D 컨텍스트를 생성할 수 없습니다');
      }
      this.context = ctx;
    }
    return this.context;
  }

  /**
   * Canvas 크기를 설정하고 내용을 정리합니다.
   */
  setupCanvas(
    width: number,
    height: number,
  ): {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
  } {
    const canvas = this.getCanvas();
    const context = this.getContext();

    // 크기 설정 (자동으로 내용이 정리됨)
    canvas.width = width;
    canvas.height = height;

    // 명시적으로 정리 (성능상 좋음)
    context.clearRect(0, 0, width, height);

    return { canvas, context };
  }

  /**
   * Canvas에 이미지를 그립니다.
   */
  drawImage(
    source: CanvasImageSource,
    dx: number = 0,
    dy: number = 0,
    dWidth?: number,
    dHeight?: number,
  ): void {
    const context = this.getContext();

    if (dWidth !== undefined && dHeight !== undefined) {
      context.drawImage(source, dx, dy, dWidth, dHeight);
    } else {
      context.drawImage(source, dx, dy);
    }
  }

  /**
   * Canvas를 Blob으로 변환합니다.
   */
  toBlob(format: string = 'image/webp', quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = this.getCanvas();

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas를 Blob으로 변환하는데 실패했습니다'));
          }
        },
        format,
        quality,
      );
    });
  }

  /**
   * 메모리 정리 (필요시만 사용)
   */
  dispose(): void {
    this.canvas = null;
    this.context = null;
  }

  /**
   * Canvas 상태 정보 반환 (디버깅용)
   */
  getCanvasInfo(): {
    created: boolean;
    width: number;
    height: number;
    hasContext: boolean;
  } {
    return {
      created: this.canvas !== null,
      width: this.canvas?.width || 0,
      height: this.canvas?.height || 0,
      hasContext: this.context !== null,
    };
  }
}

// 전역 Canvas 매니저 인스턴스
export const canvasManager = CanvasManager.getInstance();

// 편의성을 위한 직접 함수들
export const getSharedCanvas = () => canvasManager.getCanvas();

export const setupSharedCanvas = (width: number, height: number) =>
  canvasManager.setupCanvas(width, height);

export const drawToSharedCanvas = (
  source: CanvasImageSource,
  dx?: number,
  dy?: number,
  dWidth?: number,
  dHeight?: number,
) => canvasManager.drawImage(source, dx, dy, dWidth, dHeight);

export const sharedCanvasToBlob = (format?: string, quality?: number) =>
  canvasManager.toBlob(format, quality);
