import { useState, useEffect } from 'react';
import { useParticipants } from '@livekit/components-react';
import { useStompChat } from '../hooks/useStompChat';

interface ChatInputProps {
  tab: 'GROUP' | 'PRIVATE';
  preselectedReceiver?: string; // 위쪽에서 선택된 사용자 ID
}

export default function ChatInput({
  tab,
  preselectedReceiver,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  // const { sendGroupMessage, sendPrivateMessage } = useLiveKitChat(); // 목데이터용
  const { sendGroupMessage, sendPrivateMessage } = useStompChat();
  const participants = useParticipants();

  const MAX_MESSAGE_LENGTH = 500;

  // 선택된 참가자 정보 가져오기 (표시용)
  const selectedParticipant = participants
    .filter((p) => !p.isLocal)
    .find((p) => {
      try {
        const data = JSON.parse(p.metadata || '{}');
        return (data.uid?.toString() || p.sid) === preselectedReceiver;
      } catch {
        return p.sid === preselectedReceiver;
      }
    });

  const selectedParticipantName = selectedParticipant
    ? selectedParticipant.name || selectedParticipant.identity
    : null;

  // 글자 수 제한 경고 자동 숨김
  useEffect(() => {
    if (showLimitWarning) {
      const timer = setTimeout(() => setShowLimitWarning(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showLimitWarning]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;

    if (newMessage.length > MAX_MESSAGE_LENGTH) {
      setShowLimitWarning(true);
      return;
    }

    setMessage(newMessage);
    if (showLimitWarning) {
      setShowLimitWarning(false);
    }
  };

  const isMessageTooLong = message.length > MAX_MESSAGE_LENGTH;

  const handleSend = () => {
    if (!message.trim() || isMessageTooLong) return;

    if (tab === 'GROUP') {
      sendGroupMessage(message);
    } else if (tab === 'PRIVATE') {
      if (!preselectedReceiver) {
        alert('위쪽에서 메시지를 보낼 참가자를 선택하세요.');
        return;
      }
      sendPrivateMessage(preselectedReceiver, message);
    }

    setMessage('');
  };

  return (
    <div className="p-2">
      {/* 글자 수 제한 경고 */}
      {showLimitWarning && (
        <div className="mb-2 text-red-400 text-xs bg-red-900/20 border border-red-600/30 rounded px-1 py-1">
          ⚠️ 메시지는 {MAX_MESSAGE_LENGTH}자를 초과할 수 없습니다. (현재:{' '}
          {message.length}자)
        </div>
      )}

      {/* 메시지 입력 */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder={
            tab === 'GROUP'
              ? '전체 채팅 메시지를 입력하세요'
              : preselectedReceiver
                ? `${selectedParticipantName}에게 메시지 보내기`
                : '먼저 대화 상대를 선택하세요'
          }
          value={message}
          onChange={handleMessageChange}
          disabled={tab === 'PRIVATE' && !preselectedReceiver}
          className={`flex-1 bg-gray-700 text-white border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            isMessageTooLong
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-600 focus:ring-blue-500'
          }`}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />

        <button
          onClick={handleSend}
          disabled={
            !message.trim() ||
            isMessageTooLong ||
            (tab === 'PRIVATE' && !preselectedReceiver)
          }
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-sm"
        >
          전송
        </button>
      </div>
    </div>
  );
}
