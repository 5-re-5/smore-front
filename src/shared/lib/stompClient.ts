// shared/lib/stompClient.ts
import { Client } from '@stomp/stompjs';

// 네이티브 WebSocket 전용 STOMP 클라이언트
export const createStompClient = (useTestBroker = false): Client => {
  // 로컬 테스트 브로커(선택)
  const TEST_BROKER_URL =
    import.meta.env.VITE_TEST_BROKER_URL ?? 'ws://127.0.0.1:61613';

  // 네이티브 WS 엔드포인트(실서버)
  const explicit = import.meta.env.VITE_WS_URL as string | undefined;
  const back = import.meta.env.VITE_BACK_URL as string | undefined;

  // wss://.../ws 를 유도
  const nativeWsUrl = (() => {
    if (explicit) return explicit; // wss://.../ws 를 권장
    if (back?.startsWith('https://'))
      return `${back.replace(/\/+$/, '')}/ws`.replace(/^https:/, 'wss:');
    if (back?.startsWith('http://'))
      return `${back.replace(/\/+$/, '')}/ws`.replace(/^http:/, 'ws:');
    // 상대경로 폴백: 현재 페이지 스킴 따라감
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${proto}//${location.host}/ws`;
  })();

  return new Client({
    webSocketFactory: () => {
      if (useTestBroker) {
        console.log('[STOMP] TEST broker:', TEST_BROKER_URL);
        return new WebSocket(TEST_BROKER_URL);
      }
      console.log('[STOMP] Native WS endpoint:', nativeWsUrl);
      return new WebSocket(nativeWsUrl);
    },
    reconnectDelay: 0,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: (msg) => import.meta.env.DEV && console.log('[STOMP]', msg),
  });
};
