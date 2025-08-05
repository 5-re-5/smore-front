import { useEffect, useRef } from 'react';
import { createStompClient } from '@/shared/lib/stompClient';
import { useChatMessageStore } from '../model/useChatMessageStore.ts';
import { useUserStore } from '../../../entities/user/model/useUserStore.ts';
import type { ChatMessage } from '@/shared/types/chatMessage.interface.ts';

export const useStompChat = () => {
  const { addMessage } = useChatMessageStore();
  const { userId, nickname, profileUrl } = useUserStore();
  // 재렌더링 되더라도 같은 클라이언트 인스턴스 유지하기 위해 useRef 사용
  const clientRef = useRef<ReturnType<typeof createStompClient> | null>(null);

  // 스톰프 연결 & 구독
  useEffect(() => {
    // 비동기 연결 로직을 내부에서 정의
    const connectStomp = async () => {
      const client = createStompClient();
      clientRef.current = client;

      client.onConnect = () => {
        console.log('[STOMP] 연결 성공');

        // 그룹 채팅 구독
        client.subscribe('/sub/message', (msg) =>
          addMessage(JSON.parse(msg.body)),
        );

        // 개인 채팅 구독
        client.subscribe(`/sub/user/${userId}`, (msg) =>
          addMessage(JSON.parse(msg.body)),
        );

        // 시스템 메시지 구독
        client.subscribe('/sub/system', (msg) =>
          addMessage(JSON.parse(msg.body)),
        );
      };

      client.activate();
    };

    connectStomp();

    return () => {
      clientRef.current?.deactivate();
    };
  }, [addMessage, userId]);

  // 그룹 채팅 전송
  const sendGroupMessage = (content: string) => {
    const message: ChatMessage = {
      type: 'GROUP',
      sender: { userId, nickname, profileUrl },
      content,
      timestamp: new Date().toISOString(),
    };
    publish('/pub/message', message);
  };

  // 개인 채팅 전송
  const sendPrivateMessage = (receiverId: string, content: string) => {
    const message: ChatMessage = {
      type: 'PRIVATE',
      sender: { userId, nickname, profileUrl },
      receiver: receiverId,
      content,
      timestamp: new Date().toISOString(),
    };
    publish(`/pub/user/${receiverId}`, message);
  };

  // 시스템 메시지 전송
  const sendSystemMessage = (content: string) => {
    const message: ChatMessage = {
      type: 'SYSTEM',
      sender: { userId: null, nickname: 'SYSTEM', profileUrl: '' },
      content,
      timestamp: new Date().toISOString(),
    };
    publish('/pub/system', message);
  };

  // 실제 전송 함수
  const publish = (destination: string, message: ChatMessage) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(message),
      });
    } else {
      console.warn('[STOMP] 아직 연결되지 않았습니다.');
    }
  };

  return { sendGroupMessage, sendPrivateMessage, sendSystemMessage };
};
