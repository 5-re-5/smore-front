// shared/types/chat.ts

/** 서버가 내려주는 메시지 타입 (필요시 확장) */
export type ChatMessageType =
  | 'CHAT'
  | 'SYSTEM'
  | 'PRIVATE'
  | 'USER_JOIN'
  | 'USER_LEAVE'
  | 'FOCUS_START'
  | 'FOCUS_END'
  | string; // 알 수 없는 시스템 타입 대비

/** 서버 DTO: 사용자 정보 */
export interface ChatUserDTO {
  userId: number | string;
  nickname: string;
  profileUrl?: string | null;
}

/** 서버 DTO: 채팅 메시지 */
export interface ChatMessageDTO {
  messageId: number;
  roomId?: number | string;
  user: ChatUserDTO | null;       // 시스템 메시지는 null 가능
  content: string;
  messageType: ChatMessageType;   // 예: 'CHAT' | 'USER_JOIN' | ...
  createdAt: string;              // ISO 문자열
  isEdited: boolean;
  originalMessageId?: number | null;
  clientMessageId?: string;       // 클라가 붙인 중복제거용(있을 수도, 없을 수도)
  metadata?: unknown;             // 예: { liveKitParticipantId: string }
  receiver?: number | string;     // PRIVATE 등에서 사용될 수 있음(현재 미사용)
}

/** 히스토리 커서 (키셋) */
export interface ChatHistoryCursor {
  lastMessageId: number;
  lastCreatedAt: string; // ISO
}

/** GET /api/v1/study-rooms/{roomId}/messages 응답 */
export interface ChatHistoryResponse {
  data: {
    content: ChatMessageDTO[];
    hasNext: boolean;
    nextCursor?: ChatHistoryCursor | null;
    totalElements: number;
  };
}

/** GET /api/v1/study-rooms/{roomId}/sync 응답 */
export interface ChatSyncResponse {
  data: {
    messages: ChatMessageDTO[];
    count: number;
  };
}

/* ──────────────────────────────
   (선택) 요청 파라미터 타입도 같이 두면 편합니다.
   chatHttp.ts에서 사용해도 되고, 안 써도 됩니다.
────────────────────────────── */
export interface FetchHistoryParams {
  roomId: number | string;
  size?: number;                  // default 50, max 100
  lastMessageId?: number;
  lastCreatedAt?: string;         // ISO
  messageType?: ChatMessageType;  // 서버 필터(선택)
  signal?: AbortSignal;           // 요청 취소용
}

export interface FetchSinceParams {
  roomId: number | string;
  since: string;                  // ISO
  limit?: number;                 // default 50
  signal?: AbortSignal;
}
