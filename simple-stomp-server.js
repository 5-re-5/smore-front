// simple-stomp-server.js (교체 버전)
import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 61613 });
console.log('🚀 Simple STOMP Broker started on ws://localhost:61613');

const clients = new Set();
/** 각 클라이언트의 구독: Map<ws, Map<subscriptionId, destination>> */
const subs = new Map();

/** STOMP 프레임 파서(매우 단순) */
function parseFrame(text) {
  // heart-beat LF만 오는 경우
  if (text === '\n') return { command: 'HEARTBEAT' };
  // \0 제거
  const raw = text.endsWith('\0') ? text.slice(0, -1) : text;
  const [headerPart, ...bodyParts] = raw.split('\n\n');
  const lines = headerPart.split('\n');
  const command = lines.shift();
  const headers = {};
  for (const line of lines) {
    const i = line.indexOf(':');
    if (i > -1) headers[line.slice(0, i)] = line.slice(i + 1);
  }
  const body = bodyParts.join('\n\n') ?? '';
  return { command, headers, body };
}

/** MESSAGE 프레임 만들기 */
function buildMessage({ destination, subscription, body }) {
  const msgId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const bytes = Buffer.byteLength(body, 'utf8');
  return (
    `MESSAGE\n` +
    `destination:${destination}\n` +
    (subscription ? `subscription:${subscription}\n` : '') +
    `message-id:${msgId}\n` +
    `content-length:${bytes}\n\n` +
    body +
    `\0`
  );
}

wss.on('connection', (ws) => {
  console.log('✅ Client connected');
  clients.add(ws);
  subs.set(ws, new Map());

  ws.on('error', console.error);

  ws.on('message', (data) => {
    const frame = parseFrame(data.toString());
    const { command, headers, body } = frame;
    // console.log('📨', command, headers);

    if (command === 'CONNECT') {
      const resp =
        `CONNECTED\nversion:1.2\nheart-beat:0,0\n\n\0`;
      ws.send(resp);
      return;
    }

    if (command === 'SUBSCRIBE') {
      const id = headers['id'];
      const destination = headers['destination'] || '/topic/test';
      if (id) subs.get(ws)?.set(id, destination);
      console.log(`📧 SUBSCRIBE id=${id} dest=${destination}`);
      return;
    }

    if (command === 'UNSUBSCRIBE') {
      const id = headers['id'];
      subs.get(ws)?.delete(id);
      console.log(`📭 UNSUBSCRIBE id=${id}`);
      return;
    }

    if (command === 'DISCONNECT') {
      ws.close();
      return;
    }

    if (command === 'SEND') {
      const dest = headers['destination'] || '/topic/test';
      // 구독자에게만 라우팅하면서 subscription 헤더를 채워서 보냄
      for (const [client, map] of subs.entries()) {
        if (client.readyState !== client.OPEN) continue;
        for (const [subId, subDest] of map.entries()) {
          if (subDest === dest) {
            const msgFrame = buildMessage({
              destination: dest,
              subscription: subId,
              body,
            });
            client.send(msgFrame);
          }
        }
      }
      return;
    }
  });

  ws.on('close', () => {
    console.log('❌ Client disconnected');
    clients.delete(ws);
    subs.delete(ws);
  });
});
