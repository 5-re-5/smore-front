// src/features/chat/ui/ChatPanel.tsx
import { useState } from 'react';
import ChatUserList from '@/widgets/chat/ChatUserList'; // 참가자 목록 UI
import ChatMessageList from '../../features/chat/ui/ChatMessageList';
import ChatInput from '../../features/chat/ui/ChatInput';
import { useChatMessageStore } from '../../features/chat/model/useChatMessageStore';

export default function ChatPanel() {
  const [tab, setTab] = useState<'GROUP' | 'PRIVATE'>('GROUP');
  const { messages } = useChatMessageStore();

  // 현재 탭에 맞게 메시지 필터링
  const filteredMessages = messages.filter((msg) =>
    tab === 'GROUP'
      ? msg.type === 'GROUP' || msg.type === 'SYSTEM'
      : msg.type === 'PRIVATE',
  );

  return (
    <div className="flex flex-col h-full bg-[#1e2230] text-white rounded-lg overflow-hidden">
      {/* 참가자 섹션 */}
      <div className="border-b border-gray-700">
        <div className="bg-[#1e2230] px-4 py-2 border-b border-gray-700">
          <span className="text-white font-semibold text-sm">참가자</span>
        </div>
        <ChatUserList />
      </div>

      {/* 채팅 탭 */}
      <div className="flex justify-center gap-4 py-2 border-b border-gray-700">
        <button
          onClick={() => setTab('GROUP')}
          className={`px-4 py-1 rounded-full text-sm ${
            tab === 'GROUP'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setTab('PRIVATE')}
          className={`px-4 py-1 rounded-full text-sm ${
            tab === 'PRIVATE'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
        >
          개인
        </button>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-3">
        <ChatMessageList messages={filteredMessages} />
      </div>

      {/* 입력창 */}
      <div className="border-t border-gray-700 p-2">
        <ChatInput tab={tab} />
      </div>
    </div>
  );
}
