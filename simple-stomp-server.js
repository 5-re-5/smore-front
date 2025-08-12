import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 61613 });

console.log('🚀 Simple STOMP Broker started on ws://localhost:61613');

// 연결된 클라이언트들을 저장
const clients = new Set();

wss.on('connection', function connection(ws) {
  console.log('✅ Client connected');
  clients.add(ws);

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    const message = data.toString();
    console.log('📨 Received:', message);

    // STOMP CONNECT 프레임에 대한 응답
    if (message.startsWith('CONNECT')) {
      const response = `CONNECTED
version:1.2
heart-beat:0,0

\0`;
      ws.send(response);
      console.log('✅ CONNECTED frame sent');

      // 하트비트 흉내: 3초마다 LF 전송(선택)
      const hb = setInterval(() => {
        if (ws.readyState === ws.OPEN) ws.send('\n');
      }, 3000);

      ws.on('close', () => clearInterval(hb));
      return;
    }

    // STOMP SUBSCRIBE 프레임 처리
    if (message.startsWith('SUBSCRIBE')) {
      console.log('📧 Client subscribed to topic');
      return;
    }

    // STOMP SEND 프레임 처리 - 모든 클라이언트에게 브로드캐스트
    if (message.startsWith('SEND')) {
      console.log('📢 Broadcasting message to all clients');

      // 메시지 내용 추출
      const lines = message.split('\n');
      const destination = lines
        .find((line) => line.startsWith('destination:'))
        ?.split(':')[1];
      const contentLength = lines
        .find((line) => line.startsWith('content-length:'))
        ?.split(':')[1];
      const messageBody = lines[lines.length - 1].replace('\0', '');

      // MESSAGE 프레임 생성
      const messageFrame = `MESSAGE
destination:${destination || '/topic/test'}
message-id:${Date.now()}
content-length:${messageBody.length}

${messageBody}\0`;

      // 모든 연결된 클라이언트에게 전송
      clients.forEach((client) => {
        if (client !== ws && client.readyState === client.OPEN) {
          client.send(messageFrame);
        }
      });
    }
  });

  ws.on('close', function close() {
    console.log('❌ Client disconnected');
    clients.delete(ws);
  });

  // 초기 연결 확인용 핑
  ws.ping();
});
