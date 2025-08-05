import { useState } from 'react';
import { useStompChat } from '../hooks/useStompChat';
type MessageType = 'GROUP' | 'PRIVATE' | 'SYSTEM';

export default function ChatInput() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('GROUP');
  const [receiverId, setReceiverId] = useState(''); // PRIVATE일 때만 사용

  const { sendGroupMessage, sendPrivateMessage, sendSystemMessage } =
    useStompChat();

  const handleSend = () => {
    if (!message.trim()) return;

    if (messageType === 'GROUP') {
      sendGroupMessage(message);
    } else if (messageType === 'PRIVATE') {
      if (!receiverId.trim()) {
        alert('수신자 ID를 입력하세요.');
        return;
      }
      sendPrivateMessage(receiverId, message);
    } else if (messageType === 'SYSTEM') {
      sendSystemMessage(message);
    }

    setMessage('');
  };

  return (
    <div className="flex items-center gap-2 p-2 border-t">
      {/* 메시지 타입 선택 */}
      <select
        value={messageType}
        onChange={(e) => setMessageType(e.target.value as MessageType)}
        className="border p-1 rounded"
      >
        <option value="GROUP">그룹</option>
        <option value="PRIVATE">개인</option>
        <option value="SYSTEM">시스템</option>
      </select>

      {/* PRIVATE일 경우 수신자 ID 입력 */}
      {messageType === 'PRIVATE' && (
        <input
          type="text"
          placeholder="수신자 ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="border p-1 rounded w-24"
        />
      )}

      {/* 메시지 입력 */}
      <input
        type="text"
        placeholder="메시지를 입력하세요"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-1 rounded flex-1"
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />

      {/* 전송 버튼 */}
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        전송
      </button>
    </div>
  );
}
