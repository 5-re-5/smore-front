import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface RoomStateState {
  // 방별 의도적 나가기 플래그 (roomId -> boolean)
  intentionalExits: Record<number, boolean>;

  // 액션들
  setIntentionalExit: (roomId: number, isIntentional: boolean) => void;
  clearIntentionalExit: (roomId: number) => void;
  isIntentionalExit: (roomId: number) => boolean;
  clearAllExits: () => void;
}

export const useRoomStateStore = create<RoomStateState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      intentionalExits: {},

      // 의도적 나가기 플래그 설정
      setIntentionalExit: (roomId: number, isIntentional: boolean) => {
        set((state) => ({
          intentionalExits: {
            ...state.intentionalExits,
            [roomId]: isIntentional,
          },
        }));
      },

      // 특정 방의 의도적 나가기 플래그 제거
      clearIntentionalExit: (roomId: number) => {
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [roomId]: _, ...rest } = state.intentionalExits;
          return { intentionalExits: rest };
        });
      },

      // 의도적 나가기 상태 확인
      isIntentionalExit: (roomId: number) => {
        const state = get();
        return state.intentionalExits[roomId] || false;
      },

      // 모든 의도적 나가기 플래그 제거 (필요시 사용)
      clearAllExits: () => {
        set(() => ({ intentionalExits: {} }));
      },
    }),
    {
      name: 'room-state-store',
    },
  ),
);
