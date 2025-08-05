import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const createStompClient = () => {
  return new Client({
    // 실제 WebSocket 연결을 생성하는 함수
    webSocketFactory: () => new SockJS('/ws'), // Spring 서버의 STOMP endpoint
    reconnectDelay: 5000, // 재연결 대기 시간
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: (msg) => console.log('[STOMP]', msg),
  });
};
