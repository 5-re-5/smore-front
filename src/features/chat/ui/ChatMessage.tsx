import type { ChatMessage as ChatMessageType } from '@/shared/types/chatMessage.interface';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { type, sender, content, timestamp } = message;

  // 시간 포맷 변환 (예: 3:35)
  const formatTime = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  // SYSTEM 메시지 스타일 구분
  if (type === 'SYSTEM') {
    return (
      <div className="flex justify-center my-2">
        <div className="text-gray-500 px-3 text-xs">{content}</div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      {/* 프로필 이미지 */}
      <img
        src={sender.profileUrl || '/default-avatar.png'}
        alt={sender.nickname}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* 닉네임 + 시간 + 메시지 타입 라벨 */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-white truncate">
            {sender.nickname}
          </span>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {formatTime(timestamp)}
          </span>

          {/* 개인 메시지 라벨 */}
          {type === 'PRIVATE' && (
            <span className="text-xs bg-[#161929] px-2 py-0.5 rounded-full text-white flex-shrink-0">
              개인
            </span>
          )}
        </div>

        {/* 메시지 내용 */}
        <div className="text-sm text-gray-200 break-words leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}
