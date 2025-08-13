// features/chat/lib/ingest.ts
import { useChatMessageStore } from '@/features/chat/model/useChatMessageStore';
import type { ChatMessage } from '@/shared/types/chatMessage.interface';
import type {
  ChatHistoryResponse,
  ChatSyncResponse,
  // ChatMessageDTO, // 현재 미사용으로 제거
} from '@/shared/types/chat';

/** 서버 원본 → 앱 공용 메시지로 매핑 (구/신 스키마 혼용 안전) */
export const mapApiMessageToChat = (raw: any): ChatMessage => {
  const messageType =
    raw?.messageType ??
    (raw?.type === 'GROUP' ? 'CHAT' : raw?.type ?? 'CHAT');

  const createdAt = raw?.createdAt ?? raw?.timestamp ?? new Date().toISOString();

  const user =
    raw?.user ??
    (raw?.sender
      ? {
          userId: raw.sender.userId,
          nickname: raw.sender.nickname,
          profileUrl: raw.sender.profileUrl ?? null,
        }
      : null);

  const mapped: any = {
    messageId: raw?.messageId,
    clientMessageId: raw?.clientMessageId,
    roomId: raw?.roomId,
    user,
    content: raw?.content ?? '',
    messageType,
    createdAt,
    isEdited: !!raw?.isEdited,
    originalMessageId: raw?.originalMessageId ?? null,
    metadata: raw?.metadata,
    // 레거시 호환 필드
    type: raw?.type,
    timestamp: raw?.timestamp ?? createdAt,
    sender: raw?.sender,
    receiver: raw?.receiver,
  };

  return mapped as ChatMessage;
};

/** 히스토리 응답 타입: 공식 타입 또는 느슨한 원형 모두 허용 (nextCursor: null 허용) */
export type RawHistoryResponse =
  | ChatHistoryResponse
  | {
      data?: {
        content?: any[];
        hasNext?: boolean;
        nextCursor?: { lastMessageId: number; lastCreatedAt: string } | null;
        totalElements?: number;
      };
    };

/** since 동기화 응답 타입: 공식 타입 또는 느슨한 원형 허용 */
export type RawSinceResponse =
  | ChatSyncResponse
  | {
      data?: {
        messages?: any[];
        count?: number;
      };
    };

/**
 * 이력 응답을 스토어에 병합
 * - mode='initial'  : 첫 로딩(덮어쓰기)
 * - mode='older'    : 과거 페이지 추가(보통 prepend)
 * - mode='newer'    : 최신 묶음 추가(append)
 * 반환: hasNext / nextCursor( null → undefined 정규화 ) / total
 */
export const ingestHistoryResponse = (
  resp: RawHistoryResponse,
  mode: 'initial' | 'older' | 'newer' = 'older',
) => {
  const items = resp?.data?.content ?? [];
  const mapped = items.map(mapApiMessageToChat);

  const store = useChatMessageStore.getState();
  if (mode === 'initial') {
    store.setAllMessages(mapped);
  } else if (mode === 'older') {
    store.addMessages(mapped, 'prepend');
  } else {
    store.addMessages(mapped, 'append');
  }

  // nextCursor가 null인 케이스를 undefined로 정규화
  const rawCursor =
    (resp as any)?.data?.nextCursor as
      | { lastMessageId: number; lastCreatedAt: string }
      | null
      | undefined;

  return {
    hasNext: !!resp?.data?.hasNext,
    nextCursor: rawCursor ?? undefined,
    total: (resp as any)?.data?.totalElements,
  };
};

/** since 동기화 응답 머지 (대개 최신들을 append) */
export const ingestSinceResponse = (resp: RawSinceResponse) => {
  const items = resp?.data?.messages ?? [];
  const mapped = items.map(mapApiMessageToChat);
  useChatMessageStore.getState().addMessages(mapped, 'append');
  return { count: resp?.data?.count ?? mapped.length };
};

/** 다음 "과거 페이지" 요청에 쓸 커서: 스토어에서 가장 오래된 메시지 기준 */
export const getOlderCursorFromState = () => {
  const { allMessages } = useChatMessageStore.getState();
  const first = allMessages[0] as any;
  if (!first) return undefined;
  const lastMessageId = first?.messageId;
  const lastCreatedAt = first?.createdAt ?? first?.timestamp;
  if (lastMessageId == null || !lastCreatedAt) return undefined;
  return { lastMessageId, lastCreatedAt };
};

/** since 동기화 기준 시각: 스토어에서 가장 최신 메시지의 시간 */
export const getSinceFromState = () => {
  const { allMessages } = useChatMessageStore.getState();
  const last = allMessages[allMessages.length - 1] as any;
  const since = last?.createdAt ?? last?.timestamp;
  return since; // 없으면 undefined
};
