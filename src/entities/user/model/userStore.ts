import { create } from 'zustand';

interface MyUser {
  uid: number;
  nickname: string;
  profileUrl: string;
  isLogin: boolean;
  role: 'host' | 'admin' | 'guest';
  micOn: boolean;
  camOn: boolean;
  sid: string;
  setUid: (uid: number) => void;
  setNickname: (nickname: string) => void;
  setProfileUrl: (url: string) => void;
  setLogin: (isLogin: boolean) => void;
  setRole: (role: 'host' | 'admin' | 'guest') => void;
  setMicOn: (mic: boolean) => void;
  setCamOn: (cam: boolean) => void;
  setSid: (sid: string) => void;
  reset: () => void;
}

export const useUserStore = create<MyUser>((set) => ({
  uid: -1,
  nickname: '',
  profileUrl: '',
  isLogin: false,
  role: 'guest',
  micOn: true,
  camOn: true,
  sid: '',
  setUid: (uid) => set({ uid }),
  setNickname: (nickname) => set({ nickname }),
  setProfileUrl: (url) => set({ profileUrl: url }),
  setLogin: (isLogin) => set({ isLogin }),
  setRole: (role) => set({ role }),
  setMicOn: (mic) => set({ micOn: mic }),
  setCamOn: (cam) => set({ camOn: cam }),
  setSid: (sid) => set({ sid }),
  reset: () =>
    set({
      uid: -1,
      nickname: '',
      isLogin: false,
      role: 'guest',
      micOn: true,
      camOn: true,
      sid: '',
    }),
}));
