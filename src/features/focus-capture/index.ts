// Focus capture feature exports

// Core capture utilities
export { useCameraCapture } from './model/useCameraCapture';

// Image processing utilities
export {
  resizeImageToTargetSize,
  createImageResizer,
  type ImageResizerInterface,
} from './model/imageResize';

// Performance testing utilities
export {
  PerformanceProfiler,
  runCaptureBenchmark,
  PerformanceTestUtils,
} from './model/performanceTest';

// Auto capture scheduling
export {
  useAutoCaptureScheduler,
  AutoCaptureConfigManager,
  DEFAULT_AUTO_CAPTURE_CONFIG,
  type AutoCaptureConfig,
} from './model/useAutoCaptureScheduler';

// UI Components
export { CaptureButton } from './ui/CaptureButton';
