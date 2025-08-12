// features/chat/model/useChatMessageStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ChatMessage } from '@/shared/types/chatMessage.interface';

interface ChatMessageState {
  // 상태 - 전체 메시지를 하나의 배열에 저장
  allMessages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isHistoryLoaded: boolean; // 초기 히스토리 로드 완료 여부

  // 액션들
  addMessage: (message: ChatMessage) => void;
  setAllMessages: (messages: ChatMessage[]) => void;
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
  setHistoryLoaded: (loaded: boolean) => void;

  // 클라이언트 사이드 필터링 유틸리티
  getFilteredMessages: (filter: {
    type?: ChatMessage['type'] | ChatMessage['type'][];
    userId?: string;
    currentUserId?: string;
  }) => ChatMessage[];
  getMessageById: (messageId: string) => ChatMessage | undefined;
  getMessagesCount: (type?: ChatMessage['type']) => number;
}

export const useChatMessageStore = create<ChatMessageState>()(
  devtools(
    (set, get) => ({
      // 초기 상태 - 모든 메시지를 하나의 배열에 저장
      allMessages: [],
      isLoading: false,
      error: null,
      isHistoryLoaded: false,

      // 메시지 추가 (실시간으로 새 메시지 받을 때)
      addMessage: (message: ChatMessage) => {
        set((state) => {
          // 중복 메시지 체크 (같은 시간, 같은 발신자, 같은 내용)
          const isDuplicate = state.allMessages.some(
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
          const newMessages = [...state.allMessages, message];

          // 시간순 정렬 (오래된 것부터)
          newMessages.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          );

          console.log('새 메시지 추가:', message);
          return { allMessages: newMessages };
        });
      },

      // 전체 메시지 목록 설정 (히스토리 로드할 때)
      setAllMessages: (messages: ChatMessage[]) => {
        set(() => {
          console.log(`전체 메시지 목록 설정: ${messages.length}개`);
          return {
            allMessages: [...messages],
            isHistoryLoaded: true,
          };
        });
      },

      // 호환성을 위한 별칭 (기존 코드와의 호환성)
      setMessages: (messages: ChatMessage[]) => {
        get().setAllMessages(messages);
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
            updatedMessages = [...newMessages, ...state.allMessages];
          } else {
            // 뒤쪽에 추가 (새로운 메시지들)
            updatedMessages = [...state.allMessages, ...newMessages];
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
          return { allMessages: uniqueMessages };
        });
      },

      // 메시지 삭제
      removeMessage: (messageId: string) => {
        set((state) => ({
          allMessages: state.allMessages.filter((msg) => {
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
          return {
            allMessages: [],
            isHistoryLoaded: false,
          };
        });
      },

      // 메시지 업데이트 (상태 변경 등)
      updateMessage: (messageId: string, updates: Partial<ChatMessage>) => {
        set((state) => ({
          allMessages: state.allMessages.map((msg) => {
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

      // 히스토리 로드 상태 설정
      setHistoryLoaded: (loaded: boolean) => {
        set(() => ({ isHistoryLoaded: loaded }));
      },

      // 클라이언트 사이드 필터링 (핵심 기능)
      getFilteredMessages: (filter: {
        type?: ChatMessage['type'] | ChatMessage['type'][];
        userId?: string;
        currentUserId?: string;
      }) => {
        const state = get();

        return state.allMessages.filter((msg) => {
          // 타입 필터링
          if (filter.type) {
            const types = Array.isArray(filter.type)
              ? filter.type
              : [filter.type];
            if (!types.includes(msg.type)) return false;
          }

          // 개인 메시지 필터링 (특정 사용자와의 대화)
          if (filter.userId && filter.currentUserId && msg.type === 'PRIVATE') {
            const isFromSelected =
              msg.sender.userId?.toString() === filter.userId;
            const isToSelected = msg.receiver === filter.userId;
            const isFromMe =
              msg.sender.userId?.toString() === filter.currentUserId;
            const isToMe = msg.receiver === filter.currentUserId;

            return (isFromSelected && isToMe) || (isFromMe && isToSelected);
          }

          return true;
        });
      },

      // 메시지 ID로 찾기
      getMessageById: (messageId: string) => {
        const state = get();
        return state.allMessages.find((msg) => {
          const msgId = `${msg.timestamp}-${msg.sender.userId}-${msg.content}`;
          return msgId === messageId;
        });
      },

      // 메시지 개수 조회 (타입별 가능)
      getMessagesCount: (type?: ChatMessage['type']) => {
        const state = get();
        if (!type) return state.allMessages.length;
        return state.allMessages.filter((msg) => msg.type === type).length;
      },
    }),
    {
      name: 'chat-message-store', // devtools에서 보이는 이름
    },
  ),
);

// 편의 훅들 - 클라이언트 사이드 필터링 기반
export const useChatMessages = () => {
  return useChatMessageStore((state) => state.allMessages);
};

export const useAllMessages = () => {
  return useChatMessageStore((state) => state.allMessages);
};

export const useChatLoading = () => {
  return useChatMessageStore((state) => state.isLoading);
};

export const useChatError = () => {
  return useChatMessageStore((state) => state.error);
};

// 선택자 훅들 (성능 최적화) - 클라이언트 사이드 필터링 활용
export const useGroupMessages = () => {
  return useChatMessageStore((state) =>
    state.getFilteredMessages({ type: ['GROUP', 'SYSTEM'] }),
  );
};

export const usePrivateMessages = () => {
  return useChatMessageStore((state) =>
    state.getFilteredMessages({ type: 'PRIVATE' }),
  );
};

export const usePrivateMessagesWithUser = (
  userId: string,
  currentUserId: string,
) => {
  return useChatMessageStore((state) =>
    state.getFilteredMessages({
      type: 'PRIVATE',
      userId,
      currentUserId,
    }),
  );
};

// 히스토리 로드 상태 훅
export const useHistoryLoaded = () => {
  return useChatMessageStore((state) => state.isHistoryLoaded);
};
