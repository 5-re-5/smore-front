// src/features/chat/ui/ChatMessage.tsx
import type { ChatMessage as ChatMessageType } from '@/shared/types/chatMessage.interface';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { type, sender, content, timestamp } = message;

  // 시간 포맷 변환 (예: 3:35 PM)
  const formatTime = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  // SYSTEM 메시지 스타일 구분
  if (type === 'SYSTEM') {
    return (
      <div className="text-center text-gray-400 text-xs my-2">{content}</div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      {/* 프로필 이미지 */}
      <img
        src={sender.profileUrl || '/default-avatar.png'}
        alt={sender.nickname}
        className="w-8 h-8 rounded-full object-cover"
      />

      <div className="flex flex-col">
        {/* 닉네임 + 시간 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">
            {sender.nickname}
          </span>
          <span className="text-xs text-gray-400">{formatTime(timestamp)}</span>
        </div>

        {/* 메시지 내용 */}
        <div className="text-sm text-gray-200 break-words">{content}</div>
      </div>
    </div>
  );
}
