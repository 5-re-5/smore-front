import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const createStompClient = (useTestBroker = false) => {
  // 테스트 브로커 주소(없으면 기본값)
  const TEST_BROKER_URL =
    import.meta.env.VITE_TEST_BROKER_URL ?? 'ws://localhost:61613';

  // SockJS 엔드포인트(HTTP/HTTPS). 우선순위: VITE_WS_URL > VITE_BACK_URL + '/ws' > '/ws'
  const sockjsUrl = (() => {
    const explicit = import.meta.env.VITE_WS_URL; // ex) https://api.example.com/ws  또는  /ws
    if (explicit) return explicit;
    const back = import.meta.env.VITE_BACK_URL; // ex) https://api.example.com  또는  /api
    if (back) return `${back.replace(/\/+$/, '')}/ws`;
    return '/ws';
  })();

  return new Client({
    webSocketFactory: () =>
      useTestBroker ? new WebSocket(TEST_BROKER_URL) : new SockJS(sockjsUrl),

    // 재연결은 useStompChat에서 수동 관리
    reconnectDelay: 0,

    // heartbeat(서버와 합의 필요). 테스트 브로커면 보통 끔
    heartbeatIncoming: useTestBroker ? 0 : 10000,
    heartbeatOutgoing: useTestBroker ? 0 : 10000,

    // 개발일 때만 로그
    debug: (msg) => {
      if (import.meta.env.DEV) console.log('[STOMP]', msg);
    },
  });
};
