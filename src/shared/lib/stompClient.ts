import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// export const createStompClient = (useTestBroker = false) => {
//   return new Client({
//     // 실제 WebSocket 연결을 생성하는 함수
//     webSocketFactory: () => {
//       if (useTestBroker) {
//         // stomp-broker-js 테스트용 (순수 WebSocket)
//         return new WebSocket('ws://localhost:61613');
//       } else {
//         // 실제 서버용 (SockJS)
//         return new SockJS('/ws'); // Spring 서버의 STOMP endpoint
//       }
//     },
//     reconnectDelay: 5000, // 재연결 대기 시간
//     heartbeatIncoming: 4000,
//     heartbeatOutgoing: 4000,
//     debug: (msg) => console.log('[STOMP]', msg),
//   });
// };
// 태스트용
export const createStompClient = (useTestBroker = false) =>
  new Client({
    webSocketFactory: () =>
      useTestBroker ? new WebSocket('ws://localhost:61613') : new SockJS('/ws'),
    reconnectDelay: 5000,
    heartbeatIncoming: useTestBroker ? 0 : 4000,
    heartbeatOutgoing: useTestBroker ? 0 : 4000,
    debug: (msg) => console.log('[STOMP]', msg),
  });
