/* eslint-disable @typescript-eslint/no-explicit-any */
//ChatMessageList
import ChatMessage from './ChatMessage';
import type { ChatMessage as ChatMessageType } from '@/shared/types/chatMessage.interface';

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isLoadingHistory?: boolean; // 상단 '이전 메시지 로딩' 표시용(선택)
}

/** 메시지 고유 키 생성기
 * 우선순위: messageId → clientMessageId → (createdAt|timestamp + userId + content 앞부분)
 */
const getMessageKey = (m: any, fallbackIndex: number) => {
  if (m?.messageId != null) return `m:${m.messageId}`;
  if (m?.clientMessageId) return `c:${m.clientMessageId}`;
  const created = m?.createdAt ?? m?.timestamp ?? '';
  const uid = m?.user?.userId ?? m?.sender?.userId ?? 'sys';
  const content = (m?.content ?? '').slice(0, 24);
  return `f:${created}|${uid}|${content}|${fallbackIndex}`;
};

export default function ChatMessageList({
  messages,
  isLoadingHistory,
}: ChatMessageListProps) {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-gray-400 text-sm">
        아직 메시지가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 상단: 과거 로딩 상태(선택) */}
      {isLoadingHistory && (
        <div className="text-center text-gray-400 text-xs py-1">
          📜 이전 메시지를 불러오는 중…
        </div>
      )}

      {/* ⚠️ 서버 정렬을 그대로 사용: 메시지 배열을 재정렬/리버스하지 마세요 */}
      {messages.map((msg, idx) => (
        <ChatMessage key={getMessageKey(msg, idx)} message={msg} />
      ))}
    </div>
  );
}
