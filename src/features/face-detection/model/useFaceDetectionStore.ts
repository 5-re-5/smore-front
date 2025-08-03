import { create } from 'zustand';

interface FaceDetectionStore {
  faceDetected: boolean;
  setFaceDetected: (detected: boolean) => void;
}

export const useFaceDetectionStore = create<FaceDetectionStore>((set) => ({
  faceDetected: true,
  setFaceDetected: (detected) => set({ faceDetected: detected }),
}));
