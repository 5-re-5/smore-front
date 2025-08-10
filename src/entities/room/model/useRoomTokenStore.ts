import { create } from 'zustand';

interface RoomTokenStore {
  tokens: Record<number, string>;
  setToken: (roomId: number, token: string) => void;
  getToken: (roomId: number) => string | null;
  clearToken: (roomId: number) => void;
  clearAllTokens: () => void;
}

export const useRoomTokenStore = create<RoomTokenStore>((set, get) => ({
  tokens: {},

  setToken: (roomId: number, token: string) => {
    set((state) => ({
      tokens: { ...state.tokens, [roomId]: token },
    }));
  },

  getToken: (roomId: number) => {
    const { tokens } = get();
    return tokens[roomId] || null;
  },

  clearToken: (roomId: number) => {
    set((state) => {
      const newTokens = { ...state.tokens };
      delete newTokens[roomId];
      return { tokens: newTokens };
    });
  },

  clearAllTokens: () => {
    set({ tokens: {} });
  },
}));
