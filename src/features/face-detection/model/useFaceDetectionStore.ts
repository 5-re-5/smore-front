import { create } from 'zustand';

interface FaceDetectionStore {
  faceDetected: boolean;
  isFaceDetectionEnabled: boolean;
  setFaceDetected: (detected: boolean) => void;
  setFaceDetectionEnabled: (enabled: boolean) => void;
}

export const useFaceDetectionStore = create<FaceDetectionStore>((set) => ({
  faceDetected: true,
  isFaceDetectionEnabled: true,
  setFaceDetected: (detected) => set({ faceDetected: detected }),
  setFaceDetectionEnabled: (enabled) =>
    set({ isFaceDetectionEnabled: enabled }),
}));
