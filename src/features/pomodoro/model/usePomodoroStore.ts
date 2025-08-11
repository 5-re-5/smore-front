import { create } from 'zustand';

type PomodoroPhase = 'study' | 'break';

interface PomodoroState {
  phase: PomodoroPhase;
  remainingTime: number;
  isRunning: boolean;
  totalCycles: number;
  isOwner: boolean;
  studyTimeMinutes: number;
  breakTimeMinutes: number;
  start: () => void;
  pause: () => void;
  tick: () => void;
  switchPhase: () => void;
  resetTimer: () => void;
  setOwner: (isOwner: boolean) => void;
  setRoomSettings: (focusTime?: number, breakTime?: number) => void;
  updateFromSync: (
    phase: PomodoroPhase,
    remainingTime: number,
    isRunning: boolean,
    totalCycles: number,
  ) => void;
}

export const DEFAULT_STUDY_TIME = 25; // minutes
export const DEFAULT_BREAK_TIME = 5; // minutes

const getNextPhase = (currentPhase: PomodoroPhase): PomodoroPhase => {
  return currentPhase === 'study' ? 'break' : 'study';
};

const getPhaseTime = (
  phase: PomodoroPhase,
  studyTimeMinutes: number,
  breakTimeMinutes: number,
): number => {
  return phase === 'study' ? studyTimeMinutes * 60 : breakTimeMinutes * 60;
};

const shouldIncrementCycles = (currentPhase: PomodoroPhase): boolean => {
  return currentPhase === 'break';
};

const handlePhaseTransition = (state: PomodoroState) => {
  const newPhase = getNextPhase(state.phase);
  const newRemainingTime = getPhaseTime(
    newPhase,
    state.studyTimeMinutes,
    state.breakTimeMinutes,
  );
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

const createPhaseState = (
  phase: PomodoroPhase,
  studyTimeMinutes: number,
  breakTimeMinutes: number,
  isRunning = false,
) => {
  return {
    phase,
    remainingTime: getPhaseTime(phase, studyTimeMinutes, breakTimeMinutes),
    isRunning,
  };
};

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  phase: 'study',
  remainingTime: DEFAULT_STUDY_TIME * 60,
  isRunning: false,
  totalCycles: 0,
  isOwner: false,
  studyTimeMinutes: DEFAULT_STUDY_TIME,
  breakTimeMinutes: DEFAULT_BREAK_TIME,

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
      ...createPhaseState(
        newPhase,
        state.studyTimeMinutes,
        state.breakTimeMinutes,
      ),
      isRunning: false,
    });
  },

  resetTimer: () => {
    const state = get();
    set({
      ...createPhaseState(
        'study',
        state.studyTimeMinutes,
        state.breakTimeMinutes,
      ),
      totalCycles: 0,
    });
  },

  setOwner: (isOwner: boolean) => {
    set({ isOwner });
  },

  setRoomSettings: (focusTime?: number, breakTime?: number) => {
    const studyTimeMinutes = focusTime ?? DEFAULT_STUDY_TIME;
    const breakTimeMinutes = breakTime ?? DEFAULT_BREAK_TIME;

    set((state) => {
      const newRemainingTime = getPhaseTime(
        state.phase,
        studyTimeMinutes,
        breakTimeMinutes,
      );
      return {
        studyTimeMinutes,
        breakTimeMinutes,
        remainingTime: state.isRunning ? state.remainingTime : newRemainingTime,
      };
    });
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
