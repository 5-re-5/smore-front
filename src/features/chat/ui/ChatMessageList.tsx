// src/features/chat/ui/ChatMessageList.tsx
import ChatMessage from './ChatMessage';
import type { ChatMessage as ChatMessageType } from '@/shared/types/chatMessage.interface';

interface ChatMessageListProps {
  messages: ChatMessageType[];
}

export default function ChatMessageList({ messages }: ChatMessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-gray-400 text-sm">
        아직 메시지가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}
    </div>
  );
}
