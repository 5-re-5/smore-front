import { useCallback, useEffect, useRef, useState } from 'react';
import { createStompClient } from '@/shared/lib/stompClient';
import { useChatMessageStore } from '../model/useChatMessageStore';
// import { useAuth } from '@/entities/user/model/useAuth'; // 현재 미사용으로 주석 처리
import type { IMessage, StompSubscription } from '@stomp/stompjs';
import type { ChatMessage } from '@/shared/types/chatMessage.interface';

type ConnStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'failed' | 'error';

type UseStompChatOptions = {
  /** 라우터에서 받은 스터디룸 ID(문자열). 반드시 "숫자 문자열"만 전달 권장(예: "123") */
  roomIdOverride?: string;
  /** 재연결 직후 한 번 호출(동기화 트리거 등) */
  onReconnected?: () => void;
};

// 백엔드 명세 경로
const CHAT_TOPIC = (roomId: string) => `/topic/study-rooms/${roomId}/chat`;
const SEND_DEST = `/app/chat/send`;

/** 숫자 판정 유틸 */
const isNumericString = (v: unknown): v is string => typeof v === 'string' && /^\d+$/.test(v);

/** 백엔드 → UI 스키마 정규화 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeIncoming(raw: any): ChatMessage {
  // 서버: messageType = 'CHAT' | 'USER_JOIN' | ... → UI: 'GROUP' | 'SYSTEM'
  const type: ChatMessage['type'] = raw?.messageType === 'CHAT' ? 'CHAT' : 'SYSTEM';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toNumber = (x: any, fb = 0) => {
    const n = Number(x);
    return Number.isFinite(n) ? n : fb;
  };

  // 서버에서 최상위 레벨에 userId, nickname을 직접 보냄, profileUrl은 metadata.user에 있음
  const sender =
    raw?.userId != null
      ? {
          userId: toNumber(raw.userId, 0), // ✅ 최상위 userId 사용
          nickname: raw.nickname ?? '알 수 없음', // ✅ 최상위 nickname 사용  
          profileUrl: raw.profileUrl || raw.metadata?.user?.profileUrl || '/default-avatar.png', // ✅ metadata에서 profileUrl 가져오기
        }
      : {
          userId: 0,
          nickname: 'SYSTEM',
          profileUrl: '',
        };

  return {
    type,                                 // 'GROUP' | 'SYSTEM'
    sender,                               // { userId: number, ... }
    content: String(raw?.content ?? ''),
    timestamp: raw?.createdAt ?? new Date().toISOString(),
  };
}

export const useStompChat = (opts: UseStompChatOptions = {}) => {
  const { roomIdOverride, onReconnected } = opts;

  const { addMessage } = useChatMessageStore();
  // const { userId } = useAuth(); // 현재 미사용으로 주석 처리

  const clientRef = useRef<ReturnType<typeof createStompClient> | null>(null);
  const subRef = useRef<StompSubscription | null>(null);
  const isConnectedRef = useRef<boolean>(false);

  const shouldReconnectRef = useRef<boolean>(true);
  const wasDisconnectedRef = useRef<boolean>(false);
  const attemptsRef = useRef<number>(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectFnRef = useRef<() => void>(() => {});

  const [connectionStatus, setConnectionStatus] = useState<ConnStatus>('connecting');

  const clearReconnectTimer = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  /** 사용 roomId 결정: 숫자 문자열만 허용 */
  const getRoomId = async (): Promise<string> => {
    if (isNumericString(roomIdOverride)) return roomIdOverride;
    return ''; // invalid
  };

  /** 재연결 스케줄러(지수 백오프 + jitter) */
  const scheduleReconnect = () => {
    if (!shouldReconnectRef.current) return;
    attemptsRef.current += 1;
    if (attemptsRef.current > 5) {
      setConnectionStatus('failed');
      return;
    }
    const delay = Math.min(1000 * 2 ** (attemptsRef.current - 1), 15000) + Math.floor(Math.random() * 500);
    setConnectionStatus('reconnecting');
    clearReconnectTimer();
    reconnectTimerRef.current = setTimeout(() => {
      connectFnRef.current();
    }, delay);
    wasDisconnectedRef.current = true;
  };

  /** 서버 → 클라 수신 처리 */
  const onMessage = (msg: IMessage) => {
    try {
      const parsed = JSON.parse(msg.body);
      if (import.meta.env.DEV) {
        console.log('[STOMP] 받은 원본 메시지:', parsed);
        console.log('[STOMP] parsed.user:', parsed.user);
      }
      const normalized = normalizeIncoming(parsed);
      if (import.meta.env.DEV) {
        console.log('[STOMP] 정규화된 메시지:', normalized);
        console.log('[STOMP] sender 정보:', normalized.sender);
      }
      addMessage(normalized);
    } catch (e) {
      console.error('메시지 파싱 실패:', e);
    }
  };

  /** 실제 연결 로직 */
  const connectStomp = useCallback(async () => {
    setConnectionStatus('connecting');
    const client = createStompClient(false); // 실서버/테스트 전환은 stompClient.ts + .env에서 처리
    clientRef.current = client;

    client.onConnect = async () => {
      isConnectedRef.current = true;
      setConnectionStatus('connected');
      attemptsRef.current = 0;
      clearReconnectTimer();

      // 기존 구독 해제
      try {
        subRef.current?.unsubscribe?.();
      } catch {
        // 구독 해제 에러 무시
      }

      const roomId = await getRoomId();
      if (!isNumericString(roomId)) {
        console.error('[STOMP] invalid subscribe roomId:', roomIdOverride);
      } else {
        const topic = CHAT_TOPIC(roomId);
        if (import.meta.env.DEV) console.log('[STOMP] subscribe topic:', topic);
        subRef.current = client.subscribe(topic, onMessage);
      }

      // 끊김→복구 후 동기화 트리거
      if (wasDisconnectedRef.current) {
        wasDisconnectedRef.current = false;
        onReconnected?.();
        window.dispatchEvent(new Event('stomp:reconnected'));
      }
    };

    client.onDisconnect = () => {
      isConnectedRef.current = false;
      setConnectionStatus('disconnected');
      scheduleReconnect();
    };

    client.onStompError = () => {
      isConnectedRef.current = false;
      setConnectionStatus('error');
      scheduleReconnect();
    };

    client.onWebSocketClose = () => {
      isConnectedRef.current = false;
      setConnectionStatus('disconnected');
      scheduleReconnect();
    };

    client.debug = (msg) => {
      if (import.meta.env.DEV) console.log('[STOMP]', msg);
    };

    client.activate();
  }, [roomIdOverride, onReconnected]);

  // 최신 connect 함수를 ref에 저장(재연결 타이머에서 최신 로직 호출)
  useEffect(() => {
    connectFnRef.current = () => {
      Promise.resolve().then(() => connectStomp());
    };
  }, [connectStomp]);

  // 최초 연결 + 온라인/오프라인 핸들링 + 정리
  useEffect(() => {
    shouldReconnectRef.current = true;
    connectFnRef.current();

    const onOnline = () => {
      if (!isConnectedRef.current) {
        clientRef.current?.deactivate().finally(() => connectFnRef.current());
      }
    };
    const onOffline = () => setConnectionStatus('disconnected');

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      shouldReconnectRef.current = false;
      clearReconnectTimer();
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      try {
        subRef.current?.unsubscribe?.();
      } catch {
        // 구독 해제 에러 무시
      }
      clientRef.current?.deactivate();
    };
  }, []);

  /** 그룹 메시지 전송: /app/chat.send (성공/실패 반환) */
  const sendGroupMessage = async (content: string): Promise<boolean> => {
    const client = clientRef.current;
    if (!client || !isConnectedRef.current) return false;

    const roomId = await getRoomId();
    const asNumber = Number(roomId);
    if (!Number.isFinite(asNumber)) {
      console.error('[STOMP] invalid numeric roomId for send:', roomIdOverride);
      return false;
    }

    try {
      const payload = {
        roomId: asNumber, // ✅ 숫자
        content,
        messageType: 'CHAT',
      };
      if (import.meta.env.DEV) console.log('[STOMP] publish body:', payload);
      client.publish({ destination: SEND_DEST, body: JSON.stringify(payload) });
      return true;
    } catch (e) {
      console.error('메시지 전송 실패:', e);
      return false;
    }
  };

  /** 개인 메시지 전송 (현재 미구현) */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sendPrivateMessage = async (_receiverId: string, _content: string): Promise<boolean> => {
    // TODO: 개인 메시지 기능 구현 필요
    console.warn('Private message not implemented yet');
    return false;
  };

  /** 시스템 메시지 전송 (현재 미구현) */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sendSystemMessage = async (_content: string): Promise<boolean> => {
    // TODO: 시스템 메시지 기능 구현 필요
    console.warn('System message not implemented yet');
    return false;
  };

  return {
    sendGroupMessage,
    sendPrivateMessage,
    sendSystemMessage,
    isConnected: isConnectedRef.current,
    connectionStatus,
    reconnectAttempts: attemptsRef.current,
  };
};
