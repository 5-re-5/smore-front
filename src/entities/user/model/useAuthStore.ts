import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '../api/types';

interface AuthState {
  userInfo: UserInfo | null;
  userId: number | null;
  setUserInfo: (userInfo: UserInfo) => void;
  setUserId: (userId: number) => void;
  login: (userId: number, userInfo?: UserInfo) => void;
  logout: () => void;
  getUserId: () => number | null;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      userId: null,

      setUserInfo: (userInfo: UserInfo) => {
        set({ userInfo });
      },

      setUserId: (userId: number) => {
        set({ userId });
      },

      login: (userId: number, userInfo?: UserInfo) => {
        set({
          userId,
          userInfo: userInfo || null,
        });
      },

      logout: () => {
        set({
          userInfo: null,
          userId: null,
        });
      },

      getUserId: () => {
        const state = get();
        return state.userId;
      },

      isAuthenticated: () => {
        const state = get();
        return state.userId !== null;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        userInfo: state.userInfo,
        userId: state.userId,
      }),
    },
  ),
);
