import { create } from 'zustand';

type PomodoroPhase = 'study' | 'break';

interface PomodoroState {
  phase: PomodoroPhase;
  remainingTime: number;
  isRunning: boolean;
  totalCycles: number;
  isHost: boolean;
  start: () => void;
  pause: () => void;
  tick: () => void;
  switchPhase: () => void;
  resetTimer: () => void;
  setHost: (isHost: boolean) => void;
  updateFromSync: (
    phase: PomodoroPhase,
    remainingTime: number,
    isRunning: boolean,
  ) => void;
}

const STUDY_TIME = 1 * 10; // 25 minutes in seconds
const BREAK_TIME = 1 * 10; // 5 minutes in seconds

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  phase: 'study',
  remainingTime: STUDY_TIME,
  isRunning: false,
  totalCycles: 0,
  isHost: localStorage.getItem('isHost') === 'true',

  start: () => {
    set({ isRunning: true });
  },

  pause: () => {
    set({ isRunning: false });
  },

  tick: () => {
    const state = get();
    if (!state.isRunning || state.remainingTime <= 0) return;

    const newRemainingTime = state.remainingTime - 1;

    if (newRemainingTime <= 0) {
      const newPhase = state.phase === 'study' ? 'break' : 'study';
      const newRemainingTime = newPhase === 'study' ? STUDY_TIME : BREAK_TIME;
      const newTotalCycles =
        state.phase === 'break' ? state.totalCycles + 1 : state.totalCycles;

      set({
        phase: newPhase,
        remainingTime: newRemainingTime,
        totalCycles: newTotalCycles,
        isRunning: true,
      });
    } else {
      set({ remainingTime: newRemainingTime });
    }
  },

  switchPhase: () => {
    const state = get();
    const newPhase = state.phase === 'study' ? 'break' : 'study';
    const newRemainingTime = newPhase === 'study' ? STUDY_TIME : BREAK_TIME;

    set({
      phase: newPhase,
      remainingTime: newRemainingTime,
      isRunning: false,
    });
  },

  resetTimer: () => {
    set({
      phase: 'study',
      remainingTime: STUDY_TIME,
      isRunning: false,
      totalCycles: 0,
    });
  },

  setHost: (isHost: boolean) => {
    localStorage.setItem('isHost', isHost.toString());
    set({ isHost });
  },

  updateFromSync: (
    phase: PomodoroPhase,
    remainingTime: number,
    isRunning: boolean,
  ) => {
    set({ phase, remainingTime, isRunning });
  },
}));
