import { create } from 'zustand';
import type { ChatUser } from '@/entities/user/types/user.interface';

interface UserState {
  users: ChatUser[];
  setUsers: (users: ChatUser[]) => void;
  addUser: (user: ChatUser) => void;
  removeUser: (sid: string) => void;
  updateUser: (sid: string, data: Partial<ChatUser>) => void;
  setMicOn: (sid: string, on: boolean) => void;
  setCamOn: (sid: string, on: boolean) => void;
  setNickname: (sid: string, nickname: string) => void;
  reset: () => void; // 참가자 목록 초기로 되돌림
}

export const ChattingUserListStore = create<UserState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  addUser: (user) =>
    set((state) =>
      state.users.some((u) => u.sid === user.sid)
        ? state // id가 이미 존재하면 무시
        : { users: [...state.users, user] },
    ),
  removeUser: (sid) =>
    set((state) => ({ users: state.users.filter((u) => u.sid !== sid) })),
  updateUser: (sid, data) =>
    set((state) => ({
      users: state.users.map((u) => (u.sid === sid ? { ...u, ...data } : u)),
    })),
  setMicOn: (sid, on) =>
    set((state) => ({
      users: state.users.map((u) => (u.sid === sid ? { ...u, micOn: on } : u)),
    })),
  setCamOn: (sid, on) =>
    set((state) => ({
      users: state.users.map((u) => (u.sid === sid ? { ...u, camOn: on } : u)),
    })),
  setNickname: (sid, nickname) =>
    set((state) => ({
      users: state.users.map((u) => (u.sid === sid ? { ...u, nickname } : u)),
    })),
  reset: () => set({ users: [] }),
}));
