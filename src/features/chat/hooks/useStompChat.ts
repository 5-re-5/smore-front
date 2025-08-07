import { useEffect, useRef } from 'react';
import { createStompClient } from '@/shared/lib/stompClient';
import { useChatMessageStore } from '../model/useChatMessageStore';
import { useUserStore } from '../../../entities/user/model/useUserStore';
import { useRoomContext } from '@livekit/components-react';
import type { ChatMessage } from '@/shared/types/chatMessage.interface';

export const useStompChat = () => {
  const { addMessage } = useChatMessageStore();
  const { userId, nickname, profileUrl } = useUserStore();
  const room = useRoomContext();
  const clientRef = useRef<ReturnType<typeof createStompClient> | null>(null);
  const isConnectedRef = useRef(false);

  // Room ID 가져오기
  const getRoomId = async () => {
    if (room && typeof room.getSid === 'function') {
      try {
        return await room.getSid();
      } catch (error) {
        return room.name || 'default-room';
      }
    }
    return 'default-room';
  };

  useEffect(() => {
    const connectStomp = async () => {
      const client = createStompClient();
      clientRef.current = client;
      const roomId = await getRoomId();

      client.onConnect = () => {
        console.log('[STOMP] 연결 성공');
        isConnectedRef.current = true;

        // 전체 채팅 구독
        client.subscribe(`/sub/room/${roomId}`, (msg) => {
          try {
            const message = JSON.parse(msg.body);
            console.log('전체 메시지 수신:', message);
            addMessage(message);
          } catch (error) {
            console.error('전체 메시지 파싱 에러:', error);
          }
        });

        // 개인 채팅 구독
        client.subscribe(`/sub/user/${userId}`, (msg) => {
          try {
            const message = JSON.parse(msg.body);
            console.log('개인 메시지 수신:', message);
            addMessage(message);
          } catch (error) {
            console.error('개인 메시지 파싱 에러:', error);
          }
        });

        // 시스템 메시지 구독
        client.subscribe('/sub/system', (msg) => {
          try {
            const message = JSON.parse(msg.body);
            console.log('시스템 메시지 수신:', message);
            addMessage(message);
          } catch (error) {
            console.error('시스템 메시지 파싱 에러:', error);
          }
        });
      };

      client.onDisconnect = () => {
        console.log('[STOMP] 연결 해제');
        isConnectedRef.current = false;
      };

      client.onStompError = (frame) => {
        console.error('[STOMP] 에러:', frame);
        isConnectedRef.current = false;
      };

      client.activate();
    };

    connectStomp();

    return () => {
      clientRef.current?.deactivate();
    };
  }, [addMessage, userId, room]);

  // 전체 채팅 전송
  const sendGroupMessage = async (content: string) => {
    if (!isConnectedRef.current || !clientRef.current) {
      console.warn('[STOMP] 연결되지 않음 - 전체 메시지 전송 실패');
      return;
    }

    const roomId = await getRoomId();

    // 서버로 보낼 메시지
    const serverMessage = {
      type: 'GROUP',
      sender: { userId, nickname, profileUrl },
      content,
      timestamp: new Date().toISOString(),
      roomId, // 서버에서 필요한 필드
    };

    // 로컬 스토어용 메시지
    const localMessage: ChatMessage = {
      type: 'GROUP',
      sender: { userId, nickname, profileUrl },
      content,
      timestamp: new Date().toISOString(),
    };

    try {
      // 서버로 전송
      clientRef.current.publish({
        destination: '/pub/message/group', // 또는 '/pub/group'
        body: JSON.stringify(serverMessage),
      });

      console.log('📢 전체 메시지 STOMP 전송 완료');

      // 본인 채팅창에도 표시 (발신자용)
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

    // 서버로 보낼 메시지
    const serverMessage = {
      type: 'PRIVATE',
      sender: { userId, nickname, profileUrl },
      receiver: receiverId,
      content,
      timestamp: new Date().toISOString(),
      roomId,
    };

    // 로컬 스토어용 메시지
    const localMessage: ChatMessage = {
      type: 'PRIVATE',
      sender: { userId, nickname, profileUrl },
      receiver: receiverId,
      content,
      timestamp: new Date().toISOString(),
    };

    try {
      // 서버로 전송
      clientRef.current.publish({
        destination: '/pub/message/private', // 또는 '/pub/private'
        body: JSON.stringify(serverMessage),
      });

      // console.log('💬 개인 메시지 STOMP 전송 완료');

      // 본인 채팅창에도 표시
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
      clientRef.current.publish({
        destination: '/pub/message/system', // 또는 '/pub/system'
        body: JSON.stringify(serverMessage),
      });

      console.log('🔔 시스템 메시지 STOMP 전송 완료');
      addMessage(localMessage);
    } catch (error) {
      console.error('시스템 메시지 전송 실패:', error);
    }
  };

  return {
    sendGroupMessage,
    sendPrivateMessage,
    sendSystemMessage,
    isConnected: isConnectedRef.current,
  };
};
