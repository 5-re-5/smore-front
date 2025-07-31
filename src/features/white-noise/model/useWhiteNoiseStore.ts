import { create } from 'zustand';
import { getNoiseIds } from '../config/noiseConfig';

interface WhiteNoiseState {
  currentNoise: string | null;
  volume: number;
  isPlaying: boolean;
  isOpen: boolean;
  noiseList: string[];
  setCurrentNoise: (noise: string | null) => void;
  setVolume: (volume: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsOpen: (open: boolean) => void;
  togglePlay: () => void;
  setNoiseList: (list: string[]) => void;
}

export const useWhiteNoiseStore = create<WhiteNoiseState>((set) => ({
  currentNoise: null,
  volume: 50,
  isPlaying: false,
  isOpen: false,
  noiseList: getNoiseIds(), // ['rain', 'fireplace', 'leaves-steps', 'typing']
  setCurrentNoise: (noise) => set({ currentNoise: noise }),
  setVolume: (volume) => set({ volume }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsOpen: (open) => set({ isOpen: open }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setNoiseList: (list) => set({ noiseList: list }),
}));
