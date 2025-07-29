import { create } from 'zustand';

interface StopwatchState {
  isRunning: boolean;
  curStudyTime: number;
  todayTotalTime: number;
  defaultCurStudyTime: number;
  defaultTotalStudyTime: number;
  start: () => void;
  pause: () => void;
  updateTimes: () => void;
}

export const useStopwatchStore = create<StopwatchState>((set) => ({
  isRunning: false,
  curStudyTime: 0,
  todayTotalTime: 0,
  defaultCurStudyTime: 0,
  defaultTotalStudyTime: 0,

  start: () => {
    set({ isRunning: true });
  },

  pause: () => {
    set({ isRunning: false });
  },

  updateTimes: () =>
    set((state) => {
      if (state.isRunning) {
        return {
          curStudyTime: state.curStudyTime + 1,
          todayTotalTime: state.todayTotalTime + 1,
        };
      }
      return {};
    }),
}));
