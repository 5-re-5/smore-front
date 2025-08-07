import { create } from 'zustand';

interface MyUser {
  userId: number;
  socketId: string;
  nickname: string;
  profileUrl: string;
  role: 'host' | 'admin' | 'guest';
  setUid: (userId: number) => void;
  setNickname: (nickname: string) => void;
  setProfileUrl: (url: string) => void;
  setRole: (role: 'host' | 'admin' | 'guest') => void;
  setSid: (socketId: string) => void;
  reset: () => void;
}

export const useUserStore = create<MyUser>((set) => ({
  userId: -1,
  socketId: '',
  nickname: '',
  profileUrl: '',
  role: 'guest',
  setUid: (userId) => set({ userId }),
  setNickname: (nickname) => set({ nickname }),
  setProfileUrl: (url) => set({ profileUrl: url }),
  setRole: (role) => set({ role }),
  setSid: (socketId) => set({ socketId }),
  reset: () =>
    set({
      userId: -1,
      socketId: '',
      nickname: '',
      role: 'guest',
    }),
}));
