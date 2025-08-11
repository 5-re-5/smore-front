import { useCallback, useEffect, useRef, useState } from 'react';
import { createStompClient } from '@/shared/lib/stompClient';
import { useChatMessageStore } from '../model/useChatMessageStore';
import { useAuth } from '@/entities/user/model/useAuth';
import { useUserInfo } from '@/entities/user/model/useUserInfo';
import { useRoomContext } from '@livekit/components-react';
import type { ChatMessage } from '@/shared/types/chatMessage.interface';

export const useStompChat = () => {
  const { addMessage } = useChatMessageStore();
  const { userId } = useAuth();
  const { data: userInfo } = useUserInfo();
  const room = useRoomContext();

  // userInfo에서 nickname과 profileUrl 추출
  const nickname = userInfo?.nickname || 'Anonymous';
  const profileUrl = userInfo?.profileUrl || '/default-avatar.png';
  const clientRef = useRef<ReturnType<typeof createStompClient> | null>(null);
  const isConnectedRef = useRef(false);

  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ 테스트 모드 플래그(전역적으로 한번 읽어서 재사용)
  const isTestBroker = import.meta.env.VITE_STOMP_TEST_MODE === 'true';

  // ✅ 목적지 해석 헬퍼: 테스트 모드면 토픽(/sub/*)로, 실서버면 /pub/*
  const resolveDestination = useCallback(
    (
      kind: 'group' | 'private' | 'system',
      roomId: string,
      receiverId?: string,
    ) => {
      if (isTestBroker) {
        switch (kind) {
          case 'group':
            return `/sub/room/${roomId}`; // 테스트: 바로 브로드캐스트될 토픽
          case 'private':
            return `/sub/user/${receiverId}`; // 테스트: 대상 유저 토픽으로
          case 'system':
            return `/sub/system`; // 테스트: 시스템 토픽
        }
      }
      // 실서버(백엔드 라우팅): 기존 /pub 경로 유지
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

  // Room ID 가져오기
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

  const connectStomp = useCallback(async () => {
    // ✅ 테스트 모드 전달
    const client = createStompClient(isTestBroker);
    clientRef.current = client;
    const roomId = await getRoomId();

    client.onConnect = () => {
      console.log('[STOMP] 연결 성공');
      isConnectedRef.current = true;
      setConnectionStatus('connected');
      setReconnectAttempts(0);

      // 구독
      client.subscribe(`/sub/room/${roomId}`, (msg) => {
        try {
          const message = JSON.parse(msg.body);
          //  console.log('전체 메시지 수신:', message);
          addMessage(message);
        } catch (error) {
          console.error('전체 메시지 파싱 에러:', error);
        }
      });

      client.subscribe(`/sub/user/${userId}`, (msg) => {
        try {
          const message = JSON.parse(msg.body);
          //  console.log('개인 메시지 수신:', message);
          addMessage(message);
        } catch (error) {
          console.error('개인 메시지 파싱 에러:', error);
        }
      });

      client.subscribe('/sub/system', (msg) => {
        try {
          const message = JSON.parse(msg.body);
          //  console.log('시스템 메시지 수신:', message);
          addMessage(message);
        } catch (error) {
          console.error('시스템 메시지 파싱 에러:', error);
        }
      });
    };

    client.onDisconnect = () => {
      console.log('[STOMP] 연결 해제');
      isConnectedRef.current = false;
      setConnectionStatus('disconnected');
      attemptReconnect();
    };

    client.onStompError = (frame) => {
      console.error('[STOMP] 에러:', frame);
      isConnectedRef.current = false;
      setConnectionStatus('error');
      attemptReconnect();
    };

    client.activate();
  }, [addMessage, userId, room, isTestBroker]);

  const attemptReconnect = useCallback(async () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.log('최대 재연결 시도 횟수 초과');
      setConnectionStatus('failed');
      return;
    }

    setConnectionStatus('reconnecting');
    setReconnectAttempts((prev) => prev + 1);

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);

    console.log(
      `재연결 시도 ${reconnectAttempts + 1}/${maxReconnectAttempts} (${delay}ms 후)`,
    );

    reconnectTimeoutRef.current = setTimeout(async () => {
      await connectStomp();
    }, delay);
  }, [reconnectAttempts, maxReconnectAttempts, connectStomp]);

  useEffect(() => {
    connectStomp();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      clientRef.current?.deactivate();
    };
  }, [connectStomp]);

  // 전체 채팅 전송
  const sendGroupMessage = async (content: string) => {
    if (!isConnectedRef.current || !clientRef.current) {
      console.warn('[STOMP] 연결되지 않음 - 전체 메시지 전송 실패');
      return;
    }

    const roomId = await getRoomId();

    const serverMessage = {
      type: 'GROUP',
      sender: { userId, nickname, profileUrl },
      content,
      timestamp: new Date().toISOString(),
      roomId,
    };

    const localMessage: ChatMessage = {
      type: 'GROUP',
      sender: { userId, nickname, profileUrl },
      content,
      timestamp: new Date().toISOString(),
    };

    try {
      // ✅ 목적지 분기 적용
      const destination = resolveDestination('group', roomId);
      clientRef.current.publish({
        destination,
        body: JSON.stringify(serverMessage),
      });

      // 본인 채팅창에도 표시
      addMessage(localMessage);
    } catch (error) {
      console.error('전체 메시지 전송 실패:', error);
    }
  };

  // 개인 채팅 전송
  const sendPrivateMessage = async (receiverId: string, content: string) => {
    if (!isConnectedRef.current || !clientRef.current) {
      console.warn('[STOMP] 연결되지 않음 - 개인 메시지 전송 실패');
      return;
    }

    const roomId = await getRoomId();

    const serverMessage = {
      type: 'PRIVATE',
      sender: { userId, nickname, profileUrl },
      receiver: receiverId,
      content,
      timestamp: new Date().toISOString(),
      roomId,
    };

    const localMessage: ChatMessage = {
      type: 'PRIVATE',
      sender: { userId, nickname, profileUrl },
      receiver: receiverId,
      content,
      timestamp: new Date().toISOString(),
    };

    try {
      // ✅ 목적지 분기 적용 (테스트: /sub/user/{receiverId})
      const destination = resolveDestination('private', roomId, receiverId);
      clientRef.current.publish({
        destination,
        body: JSON.stringify(serverMessage),
      });

      addMessage(localMessage);
    } catch (error) {
      console.error('개인 메시지 전송 실패:', error);
    }
  };

  // 시스템 메시지 전송
  const sendSystemMessage = async (content: string) => {
    if (!isConnectedRef.current || !clientRef.current) return;

    const roomId = await getRoomId();

    const serverMessage = {
      type: 'SYSTEM',
      sender: { userId: null, nickname: 'SYSTEM', profileUrl: '' },
      content,
      timestamp: new Date().toISOString(),
      roomId,
    };

    const localMessage: ChatMessage = {
      type: 'SYSTEM',
      sender: { userId: null, nickname: 'SYSTEM', profileUrl: '' },
      content,
      timestamp: new Date().toISOString(),
    };

    try {
      // ✅ 목적지 분기 적용
      const destination = resolveDestination('system', roomId);
      clientRef.current.publish({
        destination,
        body: JSON.stringify(serverMessage),
      });

      addMessage(localMessage);
      console.log('🔔 시스템 메시지 STOMP 전송 완료');
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
    reconnectAttempts,
  };
};
