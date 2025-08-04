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
    totalCycles: number,
  ) => void;
}

export const STUDY_TIME = 25 * 60; // 25 minutes in seconds
export const BREAK_TIME = 5 * 60; // 5 minutes in seconds

const getNextPhase = (currentPhase: PomodoroPhase): PomodoroPhase => {
  return currentPhase === 'study' ? 'break' : 'study';
};

const getPhaseTime = (phase: PomodoroPhase): number => {
  return phase === 'study' ? STUDY_TIME : BREAK_TIME;
};

const shouldIncrementCycles = (currentPhase: PomodoroPhase): boolean => {
  return currentPhase === 'break';
};

const handlePhaseTransition = (state: PomodoroState) => {
  const newPhase = getNextPhase(state.phase);
  const newRemainingTime = getPhaseTime(newPhase);
  const newTotalCycles = shouldIncrementCycles(state.phase)
    ? state.totalCycles + 1
    : state.totalCycles;

  return {
    phase: newPhase,
    remainingTime: newRemainingTime,
    totalCycles: newTotalCycles,
    isRunning: true,
  };
};

const createPhaseState = (phase: PomodoroPhase, isRunning = false) => {
  return {
    phase,
    remainingTime: getPhaseTime(phase),
    isRunning,
  };
};

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

    if (newRemainingTime > 0) {
      set({ remainingTime: newRemainingTime });
      return;
    }

    set(handlePhaseTransition(state));
  },

  switchPhase: () => {
    const state = get();
    const newPhase = getNextPhase(state.phase);
    set({
      ...createPhaseState(newPhase),
      isRunning: false,
    });
  },

  resetTimer: () => {
    set({
      ...createPhaseState('study'),
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
    totalCycles: number,
  ) => {
    set({ phase, remainingTime, isRunning, totalCycles });
  },
}));
