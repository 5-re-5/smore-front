import { useState, useEffect } from 'react';
import { create } from 'zustand';

// Zustand store
interface StopwatchState {
  isRunning: boolean;
  sessionElapsedTime: number; // 현재 공부 시간
  todayTotalTime: number; // 오늘 총 공부 시간 (백엔드에서 받아오는 값 추가 예정)
  startTime: number | null;
  defaultStartTime: number; // 백엔드에서 받아오는 기본 시간 (없으면 0)
  start: () => void;
  pause: () => void;
  setTodayTotalTime: (ms: number) => void;
}

export const useStopwatchStore = create<StopwatchState>((set, get) => ({
  isRunning: false,
  sessionElapsedTime: 0,
  todayTotalTime: 0,
  startTime: null,
  defaultStartTime: 0,
  start: () => {
    if (!get().isRunning) {
      set({
        isRunning: true,
        startTime:
          Date.now() - get().sessionElapsedTime - get().defaultStartTime, // 기본 시간 + 현재 시간 차이
      });
    }
  },
  pause: () => {
    if (get().isRunning) {
      const currentElapsedTime = Date.now() - (get().startTime || 0);
      set({
        isRunning: false,
        sessionElapsedTime: currentElapsedTime, // 현재 시간 저장
        todayTotalTime: get().todayTotalTime + currentElapsedTime, // 오늘 총 공부 시간 갱신
      });
    }
  },
  setTodayTotalTime: (ms: number) => {
    set({ todayTotalTime: ms });
  },
}));
