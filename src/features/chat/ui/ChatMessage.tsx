/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChatMessage as ChatMessageType } from '@/shared/types/chatMessage.interface';

interface ChatMessageProps {
  message: ChatMessageType; // 구/신 스키마 모두 수용(아래에서 안전 접근)
}

/** 구/신 스키마 통합 유틸 */
const normalizeType = (m: any): string => {
  const t = m?.messageType ?? m?.type ?? 'CHAT';
  return t === 'GROUP' ? 'CHAT' : t; // 레거시 'GROUP' → 'CHAT'
};
const getUser = (m: any) => m?.user ?? m?.sender ?? null;
const getTimestamp = (m: any): string =>
  m?.createdAt ?? m?.timestamp ?? new Date().toISOString();

export default function ChatMessage({ message }: ChatMessageProps) {
  const type = normalizeType(message); // 'CHAT' | 'SYSTEM' | 'PRIVATE' | ...
  const user = getUser(message); // { userId, nickname, profileUrl } | null
  const content = message?.content ?? '';
  const isEdited = Boolean((message as any)?.isEdited);

  // 시간 포맷 (예: 3:35) — 서버가 정렬해 주므로 포맷만 담당
  const formatTime = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  const ts = getTimestamp(message);

  // SYSTEM 또는 user가 없는 메시지 → 센터 그레이 스타일
  if (type === 'SYSTEM' || !user) {
    return (
      <div className="flex justify-center my-2">
        <div className="text-gray-500 px-3 text-xs">
          {content}
          {isEdited && <span className="ml-1 opacity-70">(수정됨)</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      {/* 프로필 */}
      <img
        src={user.profileUrl || '/default-avatar.png'}
        alt={user.nickname || 'USER'}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* 닉네임 / 시간 / (옵션) 타입 라벨 */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-white truncate">
            {user.nickname || '알 수 없음'}
          </span>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {formatTime(ts)}
          </span>

          {/* 개인 메시지 라벨 (남겨두되, 현재는 그룹만 쓰므로 거의 안 뜸) */}
          {type === 'PRIVATE' && (
            <span className="text-xs bg-[#161929] px-2 py-0.5 rounded-full text-white flex-shrink-0">
              개인
            </span>
          )}
          {isEdited && <span className="text-xs text-gray-400">(수정됨)</span>}
        </div>

        {/* 본문 */}
        <div className="text-sm text-gray-200 break-words leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}
