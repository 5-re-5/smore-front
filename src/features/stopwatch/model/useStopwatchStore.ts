import { create } from 'zustand';
import {
  startStudyTime,
  updateStudyTime,
} from '@/entities/study/api/studyTimeApi';
import { useAuthStore } from '@/entities/user/model/useAuthStore';

interface StopwatchState {
  isRunning: boolean;
  curStudyTime: number;
  todayTotalTime: number;
  defaultCurStudyTime: number;
  defaultTotalStudyTime: number;
  apiError: string | null;
  isApiLoading: boolean;
  start: () => Promise<void>;
  pause: () => Promise<void>;
  updateTimes: () => void;
  syncWithServer: () => Promise<void>;
}

const SECONDS = 1;

export const useStopwatchStore = create<StopwatchState>((set, get) => ({
  isRunning: false,
  curStudyTime: 0,
  todayTotalTime: 0,
  defaultCurStudyTime: 0,
  defaultTotalStudyTime: 0,
  apiError: null,
  isApiLoading: false,

  start: async () => {
    const userId = useAuthStore.getState().getUserId();
    if (!userId) {
      set({ apiError: '사용자 인증이 필요합니다' });
      return;
    }

    try {
      set({ isApiLoading: true, apiError: null });
      await startStudyTime(userId);
      set({
        isRunning: true,
        isApiLoading: false,
      });
    } catch (error) {
      set({
        apiError: error instanceof Error ? error.message : 'API 호출 실패',
        isApiLoading: false,
        isRunning: true, // 로컬에서는 계속 실행
      });
    }
  },

  pause: async () => {
    const userId = useAuthStore.getState().getUserId();
    if (!userId) {
      set({
        isRunning: false,
        apiError: '사용자 인증이 필요합니다',
      });
      return;
    }

    try {
      set({ isApiLoading: true, apiError: null });
      await updateStudyTime(userId);
      set({
        isRunning: false,
        isApiLoading: false,
      });
    } catch (error) {
      set({
        apiError: error instanceof Error ? error.message : 'API 호출 실패',
        isApiLoading: false,
        isRunning: false, // 일시정지는 로컬에서도 적용
      });
    }
  },

  updateTimes: () =>
    set((state) => {
      if (state.isRunning) {
        return {
          curStudyTime: state.curStudyTime + SECONDS,
          todayTotalTime: state.todayTotalTime + SECONDS,
        };
      }
      return {};
    }),

  syncWithServer: async () => {
    const userId = useAuthStore.getState().getUserId();
    if (!userId) {
      set({ apiError: '사용자 인증이 필요합니다' });
      return;
    }

    try {
      const state = get();
      if (!state.isRunning) return;

      set({ apiError: null });
      await updateStudyTime(userId);
    } catch (error) {
      set({
        apiError: error instanceof Error ? error.message : '서버 동기화 실패',
      });
    }
  },
}));
