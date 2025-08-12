import { useCallback, useEffect, useRef, useState } from 'react';
import { createStompClient } from '@/shared/lib/stompClient';
import { useChatMessageStore } from '../model/useChatMessageStore';
import { useAuth } from '@/entities/user/model/useAuth';
import { useUserInfo } from '@/entities/user/model/useUserInfo';
import { useRoomContext } from '@livekit/components-react';
import type { ChatMessage } from '@/shared/types/chatMessage.interface';

type ConnStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'failed'
  | 'error';

// STOMP 기반 채팅 연결/재연결 안정적 관리 및 그룹/개인/시스템 메시지를 발행·수신
export const useStompChat = (opts?: { onReconnected?: () => void }) => {
  const { addMessage } = useChatMessageStore();
  const { userId } = useAuth();
  const { data: userInfo } = useUserInfo();
  const room = useRoomContext();

  const nickname = userInfo?.nickname || 'Anonymous';
  const profileUrl = userInfo?.profileUrl || '/default-avatar.png';

  const clientRef = useRef<ReturnType<typeof createStompClient> | null>(null);
  const isConnectedRef = useRef(false);

  const [connectionStatus, setConnectionStatus] =
    useState<ConnStatus>('connecting');

  // 재연결 제어
  const attemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const shouldReconnectRef = useRef(true); // 사용자가 의도적으로 나갈 땐 false로
  const wasDisconnectedRef = useRef(false); // 끊겼다가 복구됨을 표시

  const isTestBroker = import.meta.env.VITE_STOMP_TEST_MODE === 'true';

  const resolveDestination = useCallback(
    (
      kind: 'group' | 'private' | 'system',
      roomId: string,
      receiverId?: string,
    ) => {
      if (isTestBroker) {
        switch (kind) {
          case 'group':
            return `/sub/room/${roomId}`;
          case 'private':
            return `/sub/user/${receiverId}`;
          case 'system':
            return `/sub/system`;
        }
      }
      // 실서버 경로 (예시)
      switch (kind) {
        case 'group':
          return '/pub/message/group';
        case 'private':
          return '/pub/message/private';
        case 'system':
          return '/pub/message/system';
      }
    },
    [isTestBroker],
  );

  const getRoomId = async () => {
    if (room && typeof room.getSid === 'function') {
      try {
        return await room.getSid();
      } catch {
        return room.name || 'default-room';
      }
    }
    return 'default-room';
  };

  const clearReconnectTimer = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  // 최신 connect 함수를 참조하기 위한 ref (순환 의존성 회피)
  const connectStompRef = useRef<() => Promise<void>>(async () => {});

  const scheduleReconnect = () => {
    if (!shouldReconnectRef.current) return; // 의도적 종료 시 중단
    if (attemptsRef.current >= maxReconnectAttempts) {
      setConnectionStatus('failed');
      return;
    }
    attemptsRef.current += 1;
    const attempt = attemptsRef.current;
    const delay =
      Math.min(1000 * 2 ** (attempt - 1), 15000) +
      Math.floor(Math.random() * 500);

    setConnectionStatus('reconnecting');
    clearReconnectTimer();
    reconnectTimeoutRef.current = setTimeout(() => {
      connectStompRef.current();
    }, delay);

    wasDisconnectedRef.current = true;
  };

  const connectStompImpl = useCallback(async () => {
    const client = createStompClient(isTestBroker);
    clientRef.current = client;

    setConnectionStatus('connecting');
    const roomId = await getRoomId();

    client.onConnect = () => {
      isConnectedRef.current = true;
      setConnectionStatus('connected');
      attemptsRef.current = 0;
      clearReconnectTimer();

      // 재구독
      client.subscribe(`/sub/room/${roomId}`, (msg) => {
        try {
          addMessage(JSON.parse(msg.body));
        } catch (e) {
          console.error('전체 메시지 파싱 에러:', e);
        }
      });

      client.subscribe(`/sub/user/${userId}`, (msg) => {
        try {
          addMessage(JSON.parse(msg.body));
        } catch (e) {
          console.error('개인 메시지 파싱 에러:', e);
        }
      });

      client.subscribe('/sub/system', (msg) => {
        try {
          addMessage(JSON.parse(msg.body));
        } catch (e) {
          console.error('시스템 메시지 파싱 에러:', e);
        }
      });

      // 끊김 → 복구 후 동기화
      if (wasDisconnectedRef.current) {
        wasDisconnectedRef.current = false;
        // 콜백 방식
        opts?.onReconnected?.();
        // (옵션) 이벤트 브로드캐스트
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

    client.activate();
  }, [addMessage, isTestBroker, userId, room, opts]);

  // ref에 최신 connect 구현을 넣어줌
  useEffect(() => {
    connectStompRef.current = connectStompImpl;
  }, [connectStompImpl]);

  // 최초 연결 + online/offline 핸들링 + 정리
  useEffect(() => {
    shouldReconnectRef.current = true;
    connectStompRef.current();

    const onOnline = () => {
      if (!isConnectedRef.current) {
        clientRef.current
          ?.deactivate()
          .finally(() => connectStompRef.current());
      }
    };
    const onOffline = () => setConnectionStatus('disconnected');

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      shouldReconnectRef.current = false; // 의도적 종료
      clearReconnectTimer();
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      clientRef.current?.deactivate();
    };
  }, []);

  // ===== 전송 =====
  const sendGroupMessage = async (content: string) => {
    if (!isConnectedRef.current || !clientRef.current) return;
    const roomId = await getRoomId();

    const payload = {
      type: 'GROUP' as const,
      sender: { userId, nickname, profileUrl },
      content,
      timestamp: new Date().toISOString(),
      roomId,
    };

    try {
      const destination = resolveDestination('group', roomId);
      clientRef.current.publish({ destination, body: JSON.stringify(payload) });
      addMessage({ ...payload } as ChatMessage);
    } catch (error) {
      console.error('전체 메시지 전송 실패:', error);
    }
  };

  const sendPrivateMessage = async (receiverId: string, content: string) => {
    if (!isConnectedRef.current || !clientRef.current) return;
    const roomId = await getRoomId();

    const payload = {
      type: 'PRIVATE' as const,
      sender: { userId, nickname, profileUrl },
      receiver: receiverId,
      content,
      timestamp: new Date().toISOString(),
      roomId,
    };

    try {
      const destination = resolveDestination('private', roomId, receiverId);
      clientRef.current.publish({ destination, body: JSON.stringify(payload) });
      addMessage({ ...payload } as ChatMessage);
    } catch (error) {
      console.error('개인 메시지 전송 실패:', error);
    }
  };

  const sendSystemMessage = async (content: string) => {
    if (!isConnectedRef.current || !clientRef.current) return;
    const roomId = await getRoomId();

    const payload = {
      type: 'SYSTEM' as const,
      sender: { userId: null, nickname: 'SYSTEM', profileUrl: '' },
      content,
      timestamp: new Date().toISOString(),
      roomId,
    };

    try {
      const destination = resolveDestination('system', roomId);
      clientRef.current.publish({ destination, body: JSON.stringify(payload) });
      addMessage({ ...payload } as ChatMessage);
    } catch (error) {
      console.error('시스템 메시지 전송 실패:', error);
    }
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
