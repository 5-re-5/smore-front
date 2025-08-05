import { create } from 'zustand';
import type { ChatMessage } from '@/shared/types/chatMessage.interface.ts';

// 전체 채팅 메세지 상태 관리
interface ChatMessageState {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  resetMessages: () => void;
}

export const useChatMessageStore = create<ChatMessageState>((set) => ({
  messages: [],
  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),
  resetMessages: () => set({ messages: [] }),
}));
