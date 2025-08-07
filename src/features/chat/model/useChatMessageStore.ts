// features/chat/model/useChatMessageStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ChatMessage } from '@/shared/types/chatMessage.interface';

interface ChatMessageState {
  // 상태
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;

  // 액션들
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessages: (
    messages: ChatMessage[],
    position?: 'prepend' | 'append',
  ) => void;
  removeMessage: (messageId: string) => void;
  clearMessages: () => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;

  // 로딩 상태 관리
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 유틸리티
  getMessageById: (messageId: string) => ChatMessage | undefined;
  getMessagesByType: (type: ChatMessage['type']) => ChatMessage[];
  getMessagesCount: () => number;
}

export const useChatMessageStore = create<ChatMessageState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      messages: [],
      isLoading: false,
      error: null,

      // 메시지 추가 (실시간으로 새 메시지 받을 때)
      addMessage: (message: ChatMessage) => {
        set((state) => {
          // 중복 메시지 체크 (같은 시간, 같은 발신자, 같은 내용)
          const isDuplicate = state.messages.some(
            (msg) =>
              msg.timestamp === message.timestamp &&
              msg.sender.userId === message.sender.userId &&
              msg.content === message.content,
          );

          if (isDuplicate) {
            console.warn('중복 메시지 무시:', message);
            return state;
          }

          // 새 메시지를 맨 뒤에 추가 (최신 메시지)
          const newMessages = [...state.messages, message];

          // 시간순 정렬 (오래된 것부터)
          newMessages.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          );

          console.log('새 메시지 추가:', message);
          return { messages: newMessages };
        });
      },

      // 메시지 목록 설정 (히스토리 로드할 때)
      setMessages: (messages: ChatMessage[]) => {
        set(() => {
          console.log(`메시지 목록 설정: ${messages.length}개`);
          return { messages: [...messages] };
        });
      },

      // 메시지 목록 추가 (무한 스크롤용)
      addMessages: (
        newMessages: ChatMessage[],
        position: 'prepend' | 'append' = 'append',
      ) => {
        set((state) => {
          let updatedMessages: ChatMessage[];

          if (position === 'prepend') {
            // 앞쪽에 추가 (오래된 메시지들)
            updatedMessages = [...newMessages, ...state.messages];
          } else {
            // 뒤쪽에 추가 (새로운 메시지들)
            updatedMessages = [...state.messages, ...newMessages];
          }

          // 중복 제거 (timestamp + userId + content 기준)
          const uniqueMessages = updatedMessages.filter((msg, index, arr) => {
            return (
              arr.findIndex(
                (m) =>
                  m.timestamp === msg.timestamp &&
                  m.sender.userId === msg.sender.userId &&
                  m.content === msg.content,
              ) === index
            );
          });

          // 시간순 정렬
          uniqueMessages.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          );

          console.log(
            `메시지 추가 (${position}): ${newMessages.length}개, 총 ${uniqueMessages.length}개`,
          );
          return { messages: uniqueMessages };
        });
      },

      // 메시지 삭제
      removeMessage: (messageId: string) => {
        set((state) => ({
          messages: state.messages.filter((msg) => {
            // ID가 없는 경우 timestamp + content로 식별
            if (!messageId) return true;

            // 실제 ID가 있는 경우 (백엔드에서 생성된 메시지)
            const msgId = `${msg.timestamp}-${msg.sender.userId}-${msg.content}`;
            return msgId !== messageId;
          }),
        }));
      },

      // 모든 메시지 삭제
      clearMessages: () => {
        set(() => {
          console.log('모든 메시지 삭제');
          return { messages: [] };
        });
      },

      // 메시지 업데이트 (상태 변경 등)
      updateMessage: (messageId: string, updates: Partial<ChatMessage>) => {
        set((state) => ({
          messages: state.messages.map((msg) => {
            const msgId = `${msg.timestamp}-${msg.sender.userId}-${msg.content}`;
            return msgId === messageId ? { ...msg, ...updates } : msg;
          }),
        }));
      },

      // 로딩 상태 설정
      setLoading: (loading: boolean) => {
        set(() => ({ isLoading: loading }));
      },

      // 에러 상태 설정
      setError: (error: string | null) => {
        set(() => ({ error }));
      },

      // 메시지 ID로 찾기
      getMessageById: (messageId: string) => {
        const state = get();
        return state.messages.find((msg) => {
          const msgId = `${msg.timestamp}-${msg.sender.userId}-${msg.content}`;
          return msgId === messageId;
        });
      },

      // 타입별 메시지 조회
      getMessagesByType: (type: ChatMessage['type']) => {
        const state = get();
        return state.messages.filter((msg) => msg.type === type);
      },

      // 메시지 개수 조회
      getMessagesCount: () => {
        const state = get();
        return state.messages.length;
      },
    }),
    {
      name: 'chat-message-store', // devtools에서 보이는 이름
    },
  ),
);

// 편의 훅들
export const useChatMessages = () => {
  return useChatMessageStore((state) => state.messages);
};

export const useChatLoading = () => {
  return useChatMessageStore((state) => state.isLoading);
};

export const useChatError = () => {
  return useChatMessageStore((state) => state.error);
};

// 선택자 훅들 (성능 최적화)
export const useGroupMessages = () => {
  return useChatMessageStore((state) =>
    state.messages.filter(
      (msg) => msg.type === 'GROUP' || msg.type === 'SYSTEM',
    ),
  );
};

export const usePrivateMessages = () => {
  return useChatMessageStore((state) =>
    state.messages.filter((msg) => msg.type === 'PRIVATE'),
  );
};

export const usePrivateMessagesWithUser = (
  userId: string,
  currentUserId: string,
) => {
  return useChatMessageStore((state) =>
    state.messages.filter((msg) => {
      if (msg.type !== 'PRIVATE') return false;

      // 선택된 사용자와의 대화만
      return (
        (msg.sender.userId?.toString() === userId &&
          msg.receiver === currentUserId) ||
        (msg.sender.userId?.toString() === currentUserId &&
          msg.receiver === userId)
      );
    }),
  );
};
