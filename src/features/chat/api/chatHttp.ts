// features/chat/api/chatHttp.ts
import type {
  ChatHistoryResponse,
  ChatSyncResponse,
  ChatMessageType,
} from '@/shared/types/chat';
import { request } from '@/shared/api/request';

/** 사용자에게는 노출하지 않을 안전한 API 에러 */
export class ApiError extends Error {
  code: 'NETWORK' | 'AUTH' | 'NON_JSON' | 'SERVER' | 'UNKNOWN';
  status?: number;
  url?: string;
  constructor(
    code: ApiError['code'],
    message: string,
    opts?: { status?: number; url?: string }
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = opts?.status;
    this.url = opts?.url;
  }
}


/** 이력 페이지네이션 */
export async function fetchHistory(params: {
  roomId: string | number;
  size?: number; // default 50, max 100
  lastMessageId?: number;
  lastCreatedAt?: string; // ISO
  messageType?: ChatMessageType;
  signal?: AbortSignal;
}): Promise<ChatHistoryResponse> {
  const { roomId, size, lastMessageId, lastCreatedAt, messageType, signal } = params;
  
  try {
    const response = await request<ChatHistoryResponse>({
      method: 'GET',
      url: `/api/v1/study-rooms/${roomId}/messages`,
      params: {
        size,
        lastMessageId,
        lastCreatedAt,
        messageType,
      },
      signal,
    });
    return response.data;
  } catch (error: any) {
    if (error.code === 401 || error.code === 403) {
      throw new ApiError('AUTH', 'Unauthorized', { status: error.code });
    }
    throw new ApiError('NETWORK', error.message || 'Network error');
  }
}

/** 재연결 등 누락분 동기화 */
export async function fetchSince(params: {
  roomId: string | number;
  since: string; // ISO (strict > 기준 권장)
  limit?: number; // default 50
  signal?: AbortSignal;
}): Promise<ChatSyncResponse> {
  const { roomId, since, limit, signal } = params;
  
  try {
    const response = await request<ChatSyncResponse>({
      method: 'GET',
      url: `/api/v1/study-rooms/${roomId}/sync`,
      params: {
        since,
        limit,
      },
      signal,
    });
    return response.data;
  } catch (error: any) {
    if (error.code === 401 || error.code === 403) {
      throw new ApiError('AUTH', 'Unauthorized', { status: error.code });
    }
    throw new ApiError('NETWORK', error.message || 'Network error');
  }
}
