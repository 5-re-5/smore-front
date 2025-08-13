/* eslint-disable @typescript-eslint/no-explicit-any */
// features/chat/model/useChatMessageStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ChatMessage } from '@/shared/types/chatMessage.interface';

/**
 * ✅ 이 스토어가 보장하는 것
 * - (기본) 서버가 준 정렬을 **그대로 유지**하여 렌더 (정렬 OFF)
 * - messageId → clientMessageId → (createdAt/timestamp + userId + content) 순으로 **중복 제거**
 * - 구 스키마( type/timestamp/sender )와 신 스키마( messageType/createdAt/user )를 모두 **흡수**
 * - update/remove/getById는 messageId 또는 clientMessageId 기준
 *
 * ⚙️ 옵션:
 * - RESPECT_SERVER_ORDER: true 이면 정렬을 절대 수행하지 않음 (서버 순서 그대로)
 * - SERVER_ORDER_ASC: 서버가 오래된→최신(오름차순)으로 내려주면 true, 최신→오래된이면 false
 */
const RESPECT_SERVER_ORDER = true; // 서버 정렬을 그대로 사용 (정렬 로직 OFF)
const SERVER_ORDER_ASC = true; // 서버 정렬이 오름차순이면 true, 내림차순이면 false

/* ------------------------------ 유틸 ------------------------------ */

/** 메시지 타입 통일: 'GROUP'|'SYSTEM'|'PRIVATE'(구) → 'CHAT'|'SYSTEM'|'PRIVATE'(신) */
const normalizeType = (msg: any): 'CHAT' | 'SYSTEM' | 'PRIVATE' | string => {
  if (msg?.messageType) return msg.messageType;
  if (msg?.type === 'GROUP') return 'CHAT';
  if (msg?.type === 'SYSTEM') return 'SYSTEM';
  if (msg?.type === 'PRIVATE') return 'PRIVATE';
  return String(msg?.type ?? 'CHAT');
};

/** 보낸 사람 userId 통일 */
const getUserIdFrom = (msg: any): string | number | undefined => {
  return (
    msg?.user?.userId ?? msg?.sender?.userId ?? msg?.senderId ?? msg?.authorId
  );
};

/** createdAt(신) 또는 timestamp(구) → ms */
const toTime = (msg: any): number => {
  const iso = msg?.createdAt ?? msg?.timestamp;
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(t) ? 0 : t;
};

/** 중복 판별용 키 (서버 ID 우선) */
const primaryId = (msg: any): string => {
  if (msg?.messageId != null) return `m:${String(msg.messageId)}`;
  if (msg?.clientMessageId) return `c:${String(msg.clientMessageId)}`;
  const uid = getUserIdFrom(msg);
  return `f:${msg?.createdAt ?? msg?.timestamp ?? ''}|${uid ?? ''}|${msg?.content ?? ''}`;
};

/** (정렬 ON일 때만 사용) 오름차순 정렬: createdAt/timestamp → messageId */
const compareAsc = (a: any, b: any) => {
  const ta = toTime(a);
  const tb = toTime(b);
  if (ta !== tb) return ta - tb;
  const am = a?.messageId,
    bm = b?.messageId;
  if (typeof am === 'number' && typeof bm === 'number') return am - bm;
  return String(am ?? '').localeCompare(String(bm ?? ''));
};

/* ---------------------------- 스토어 타입 ---------------------------- */

interface ChatMessageState {
  allMessages: ChatMessage[]; // 서버 정렬을 그대로 유지
  isLoading: boolean;
  error: string | null;
  isHistoryLoaded: boolean;

  // 기본 액션
  addMessage: (message: ChatMessage) => void;
  setAllMessages: (messages: ChatMessage[]) => void;
  setMessages: (messages: ChatMessage[]) => void; // 별칭(호환)
  addMessages: (
    messages: ChatMessage[],
    position?: 'prepend' | 'append',
  ) => void;
  updateMessage: (
    messageId: string | number,
    updates: Partial<ChatMessage>,
  ) => void;
  removeMessage: (messageId: string | number) => void;
  clearMessages: () => void;

  // 상태
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHistoryLoaded: (loaded: boolean) => void;

  // 조회 유틸 (구/신 스키마 모두 허용)
  getFilteredMessages: (filter: {
    type?: any; // ChatMessage['type'] | ChatMessage['messageType'] | 배열
    userId?: string;
    currentUserId?: string;
  }) => ChatMessage[];
  getMessageById: (messageId: string | number) => ChatMessage | undefined;
  getMessagesCount: (type?: any) => number;
}

export const useChatMessageStore = create<ChatMessageState>()(
  devtools(
    (set, get) => ({
      allMessages: [],
      isLoading: false,
      error: null,
      isHistoryLoaded: false,

      /* -------------------------- 단건 추가(실시간) -------------------------- */
      addMessage: (incoming: ChatMessage) => {
        set((state) => {
          const next = [...state.allMessages];
          const key = primaryId(incoming);
          const idx = next.findIndex((m) => primaryId(m) === key);

          if (idx >= 0) {
            // 서버 에코가 낙관적 메시지를 대체하도록 병합
            next[idx] = { ...next[idx], ...incoming };
          } else {
            // 서버 정렬을 존중: 오름차순이면 뒤에, 내림차순이면 앞에 붙인다
            if (RESPECT_SERVER_ORDER) {
              if (SERVER_ORDER_ASC) {
                next.push(incoming);
              } else {
                next.unshift(incoming);
              }
            } else {
              next.push(incoming);
              next.sort(compareAsc);
            }
          }

          return { allMessages: next };
        });
      },

      /* -------------------------- 전체 설정(초기 이력) -------------------------- */
      setAllMessages: (messages: ChatMessage[]) => {
        console.log('📝 setAllMessages 호출됨:', {
          messagesCount: messages.length,
          messages: messages.slice(0, 2),
        });
        set(() => {
          // 중복 병합(순서 보존): 먼저 들어온 항목의 "자리"를 유지하면서 데이터는 최신으로 합쳐짐
          const dedup = new Map<string, ChatMessage>();
          for (const m of messages) {
            const k = primaryId(m);
            if (!dedup.has(k)) dedup.set(k, m);
            else dedup.set(k, { ...dedup.get(k)!, ...m });
          }
          const arr = [...dedup.values()];
          if (!RESPECT_SERVER_ORDER) arr.sort(compareAsc);
          console.log('📝 setAllMessages 완료:', {
            resultCount: arr.length,
            isHistoryLoaded: true,
          });
          return { allMessages: arr, isHistoryLoaded: true };
        });
      },

      // 구 API 호환
      setMessages: (messages: ChatMessage[]) => {
        get().setAllMessages(messages);
      },

      /* ------------------------ 다건 추가(히스토리 페이지) ------------------------ */
      addMessages: (
        newMessages: ChatMessage[],
        position: 'prepend' | 'append' = 'append',
      ) => {
        set((state) => {
          // position 힌트에 따라 앞/뒤로 합치되, 최종 순서는 서버가 내려준 순서를 존중
          const merged =
            position === 'prepend'
              ? [...newMessages, ...state.allMessages]
              : [...state.allMessages, ...newMessages];

          const dedup = new Map<string, ChatMessage>();
          for (const m of merged) {
            const k = primaryId(m);
            if (!dedup.has(k)) dedup.set(k, m);
            else dedup.set(k, { ...dedup.get(k)!, ...m }); // 같은 자리 유지 + 데이터 갱신
          }
          const arr = [...dedup.values()];
          if (!RESPECT_SERVER_ORDER) arr.sort(compareAsc);
          return { allMessages: arr };
        });
      },

      /* ------------------------------ 업데이트 ------------------------------ */
      updateMessage: (
        messageId: string | number,
        updates: Partial<ChatMessage>,
      ) => {
        set((state) => {
          const next = state.allMessages.map((m: any) => {
            const mid = m?.messageId != null ? String(m.messageId) : undefined;
            const cid =
              m?.clientMessageId != null
                ? String(m.clientMessageId)
                : undefined;
            const cmp = String(messageId);
            if (mid === cmp || cid === cmp) return { ...m, ...updates };
            return m;
          });
          if (!RESPECT_SERVER_ORDER) next.sort(compareAsc);
          return { allMessages: next };
        });
      },

      /* -------------------------------- 삭제 -------------------------------- */
      removeMessage: (messageId: string | number) => {
        set((state) => {
          const cmp = String(messageId);
          const filtered = state.allMessages.filter((m: any) => {
            const mid = m?.messageId != null ? String(m.messageId) : undefined;
            const cid =
              m?.clientMessageId != null
                ? String(m.clientMessageId)
                : undefined;
            if (mid && mid === cmp) return false;
            if (cid && cid === cmp) return false;
            return true;
          });
          return { allMessages: filtered };
        });
      },

      /* ------------------------------ 초기화 ------------------------------ */
      clearMessages: () => {
        console.log('🗑️ clearMessages 호출됨 - 스토어 초기화');
        set(() => ({ allMessages: [], isHistoryLoaded: false }));
      },

      /* ------------------------------ 상태 ------------------------------ */
      setLoading: (loading: boolean) => set(() => ({ isLoading: loading })),
      setError: (error: string | null) => set(() => ({ error })),
      setHistoryLoaded: (loaded: boolean) =>
        set(() => ({ isHistoryLoaded: loaded })),

      /* ----------------------------- 필터/조회 ----------------------------- */
      getFilteredMessages: (filter) => {
        const state = get();
        const types = filter.type
          ? Array.isArray(filter.type)
            ? filter.type
            : [filter.type]
          : undefined;

        return state.allMessages.filter((msg: any) => {
          // 타입 필터(구/신 통합). 'GROUP'이 넘어와도 'CHAT'과 매칭되도록 허용
          if (types && types.length) {
            const norm = normalizeType(msg);
            const ok = types.some((t) => {
              if (t === 'GROUP') return norm === 'CHAT';
              return norm === t || norm === String(t);
            });
            if (!ok) return false;
          }

          // PRIVATE 쿼리(레거시 호환): sender/receiver 기준
          if (
            filter.userId &&
            filter.currentUserId &&
            normalizeType(msg) === 'PRIVATE'
          ) {
            const from = String(getUserIdFrom(msg) ?? '');
            const to = String(msg?.receiver ?? msg?.to ?? '');
            const sel = String(filter.userId);
            const me = String(filter.currentUserId);
            const isFromSelected = from === sel;
            const isToSelected = to === sel;
            const isFromMe = from === me;
            const isToMe = to === me;
            return (isFromSelected && isToMe) || (isFromMe && isToSelected);
          }

          return true;
        });
      },

      getMessageById: (messageId: string | number) => {
        const state = get();
        const cmp = String(messageId);
        return state.allMessages.find((m: any) => {
          const mid = m?.messageId != null ? String(m.messageId) : undefined;
          const cid =
            m?.clientMessageId != null ? String(m.clientMessageId) : undefined;
          return mid === cmp || cid === cmp;
        });
      },

      getMessagesCount: (type?: any) => {
        const state = get();
        if (!type) return state.allMessages.length;
        return state.allMessages.filter(
          (m) => normalizeType(m) === (type === 'GROUP' ? 'CHAT' : type),
        ).length;
      },
    }),
    { name: 'chat-message-store' },
  ),
);

/* ------------------------------ 선택자 훅 ------------------------------ */
// 전체
export const useAllMessages = () => useChatMessageStore((s) => s.allMessages);

// 로딩/에러
export const useChatLoading = () => useChatMessageStore((s) => s.isLoading);
export const useChatError = () => useChatMessageStore((s) => s.error);

// 히스토리 로드 여부
export const useHistoryLoaded = () =>
  useChatMessageStore((s) => s.isHistoryLoaded);

// 그룹(= CHAT) + 시스템
export const useGroupMessages = () =>
  useChatMessageStore((s) =>
    s.getFilteredMessages({ type: ['CHAT', 'SYSTEM'] }),
  );

// 개인(레거시 호환; 현재 프로젝트에선 비사용)
export const usePrivateMessages = () =>
  useChatMessageStore((s) => s.getFilteredMessages({ type: 'PRIVATE' }));

export const usePrivateMessagesWithUser = (
  userId: string,
  currentUserId: string,
) =>
  useChatMessageStore((s) =>
    s.getFilteredMessages({ type: 'PRIVATE', userId, currentUserId }),
  );
