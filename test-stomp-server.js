import http from 'http';
import StompServer from 'stomp-broker-js';

// HTTP 서버 생성
const server = http.createServer();

// STOMP 서버 생성
const stompServer = new StompServer({
  server: server,
  debug: console.log,
  heartbeat: [10000, 10000],
  heartbeatErrorMargin: 1000,
});

// 모든 메시지 구독 및 로깅
stompServer.subscribe('/**', function (msg, headers) {
  const topic = headers.destination;
  console.log(`📨 [${new Date().toLocaleTimeString()}] ${topic} ->`, msg);
  console.log(`   Headers:`, headers);
});

// 서버 시작
const PORT = 61613;
server.listen(PORT, () => {
  console.log(`🚀 STOMP Broker started on ws://localhost:${PORT}`);
  console.log('📝 Listening for messages on all topics...');
});

// 에러 처리
server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

stompServer.on('error', (err) => {
  console.error('❌ STOMP error:', err);
});

// 연결 이벤트
stompServer.on('connect', (sessionId) => {
  console.log(`✅ Client connected: ${sessionId}`);
});

stompServer.on('disconnect', (sessionId) => {
  console.log(`❌ Client disconnected: ${sessionId}`);
});
