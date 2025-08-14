// shared/types/chatMessage.interface.ts
import type { ChatMessageType } from '@/shared/types/chat';

export interface ChatMessage {
  /* ===== 신 스키마(서버/스토어 기준) ===== */
  messageId?: number; // 서버 메시지 ID
  clientMessageId?: string; // 클라 임시 ID(낙관적)
  roomId?: number | string;
  user?: {
    // 보낸 사람(신 스키마)
    userId: number;
    nickname: string;
    profileUrl: string | null;
  } | null;
  content: string; // 본문(기존 유지)
  messageType?: ChatMessageType; // 'CHAT' | 'SYSTEM' | (필요시 'PRIVATE')
  createdAt?: string; // 'YYYY-MM-DD HH:mm:ss' 또는 ISO
  isEdited?: boolean;
  originalMessageId?: number | null;
  metadata?: Record<string, unknown>;

  /* ===== 구 스키마(렌더/호환) ===== */
  // UI 일부가 여전히 'type'을 참조하므로 남겨둡니다.
  type?: 'CHAT' | 'SYSTEM' | 'GROUP' | 'PRIVATE' | string;
  sender?: {
    // 보낸 사람(구 스키마)
    userId: number | null; // system 메시지 null 가능 (기존 유지)
    nickname: string;
    profileUrl: string;
  } | null;
  timestamp?: string;
  receiver?: string | number; // 기존 유지
}
