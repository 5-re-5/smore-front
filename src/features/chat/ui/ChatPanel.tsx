import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from '@tanstack/react-router';
import ChatUserList from '@/features/chat/ui/ChatUserList';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';

import {
  useChatMessageStore,
  useAllMessages,
} from '../model/useChatMessageStore';

import { useChatHistory } from '../lib/useChatHistory';
import { useParticipants } from '@livekit/components-react';
// import { useAuth } from '@/entities/user/model/useAuth'; // 현재 미사용으로 주석 처리
import { useStompChat } from '../hooks/useStompChat';

interface ChatPanelProps {
  isOpen?: boolean;
}

const isNumericString = (v: unknown): v is string =>
  typeof v === 'string' && /^\d+$/.test(v);

export default function ChatPanel({ isOpen }: ChatPanelProps = {}) {
  const IS_TEST_MODE = import.meta.env.VITE_STOMP_TEST_MODE === 'true';

  // ✅ 라우트에서 스터디룸 ID를 직접 사용 (/room/$roomId)
  const { roomId: roomIdParam } = useParams({ from: '/room/$roomId' });

  // ✅ 백엔드가 요구하는 "숫자 문자열"만 허용
  const studyRoomId = useMemo(
    () => (isNumericString(roomIdParam ?? '') ? roomIdParam! : ''),
    [roomIdParam]
  );
  const invalidRoomId = studyRoomId === '';

  const participants = useParticipants();

  // ✅ STOMP 연결은 여기서만 열고, ChatInput엔 함수/상태만 내려준다(중복 연결 방지)
  const { sendGroupMessage, connectionStatus, reconnectAttempts } = useStompChat(
    studyRoomId ? { roomIdOverride: studyRoomId } : {}
  );
  const status = connectionStatus;

  // ── 히스토리/동기화 훅 ──────────────────────────────────────────────
  const {
    isInitialLoading,
    isPaging,
    // isSyncing, // 현재 미사용으로 주석 처리
    hasNext,
    error: historyError,
    loadOlder,
    // loadInitial, // 현재 미사용으로 주석 처리
    reset,
  } = useChatHistory(studyRoomId, {
    pageSize: 50,
    autoInitial: !IS_TEST_MODE && !invalidRoomId,        // ✅ invalid면 자동 로드 X
    autoSinceOnReconnect: !IS_TEST_MODE && !invalidRoomId,
  });

  // ── 스토어 & 필터 ──────────────────────────────────────────────────
  const { getFilteredMessages } = useChatMessageStore();
  const allMessages = useAllMessages();

  // 화면엔 'CHAT' + 'SYSTEM'만 노출 (스토어에서 CHAT으로 저장되므로)
  const filteredMessages = useMemo(
    () => getFilteredMessages({ type: ['CHAT', 'SYSTEM'] }),
    [getFilteredMessages, allMessages]
  );

  // ── 스크롤 상태 & 유틸 ─────────────────────────────────────────────
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState('');
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  // 패널 오픈 시 살짝 지연 후 하단 고정
  useEffect(() => {
    if (isOpen) setTimeout(() => scrollToBottom(true), 200);
  }, [isOpen, scrollToBottom]);

  const isNearBottom = useCallback(
    (el: HTMLElement, threshold = 100) =>
      el.scrollHeight - el.scrollTop - el.clientHeight <= threshold,
    []
  );

  // 새 메시지 감지 → 자동 스크롤 or 배지
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || filteredMessages.length === 0) return;
    if (isPaging || isInitialLoading || isLoadingHistory) return;

    const last: any = filteredMessages[filteredMessages.length - 1];
    const ts = last?.createdAt ?? last?.timestamp ?? '';

    const isNewTail = ts !== lastMessageTimestamp && lastMessageTimestamp !== '';
    if (isNewTail) {
      if (isNearBottom(el)) scrollToBottom();
      else {
        setNewMessageCount((v) => v + 1);
        setShowNewMessageButton(true);
      }
    }
    setLastMessageTimestamp(ts);
  }, [
    filteredMessages,
    isPaging,
    isInitialLoading,
    isLoadingHistory,
    lastMessageTimestamp,
    isNearBottom,
    scrollToBottom,
  ]);

  // 상단 “더 보기” 버튼
  const handleScrollTop = async () => {
    if (IS_TEST_MODE || invalidRoomId) return; // 테스트/invalid일 땐 히스토리 없음
    if (isPaging || isInitialLoading) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    const prevH = el.scrollHeight;
    const prevTop = el.scrollTop;

    setIsLoadingHistory(true);
    try {
      if (hasNext) await loadOlder();
      requestAnimationFrame(() => {
        const newH = el.scrollHeight;
        el.scrollTop = prevTop + (newH - prevH);
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // 수동 새로고침(이력 리셋 + 초기 1페이지)
  const handleRefresh = async () => {
    if (IS_TEST_MODE || invalidRoomId) return;
    reset(); // reset()에서 이미 loadInitial()을 호출하므로 중복 호출 제거
    setTimeout(() => scrollToBottom(true), 50);
  };

  // RoomId가 잘못된 경우 사용자 안내
  const invalidBanner =
    invalidRoomId && (
      <div className="bg-red-600/20 border border-red-600/50 text-red-200 p-2 mx-3 mt-2 rounded text-sm">
        ⚠️ 잘못된 방 ID입니다. 숫자 형태의 studyRoomId가 필요합니다.
      </div>
    );

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#2A2F46] text-white overflow-hidden pb-3 -mt-3">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">
            참가자({participants.length})
          </span>
          {allMessages.length > 0 && (
            <span className="text-xs text-gray-400">
              • 전체 {allMessages.length}개 | 현재 {filteredMessages.length}개
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!IS_TEST_MODE && !invalidRoomId && (
            <button
              onClick={handleRefresh}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-700"
              disabled={isInitialLoading}
            >
              {isInitialLoading ? '로딩...' : '새로고침'}
            </button>
          )}
          {IS_TEST_MODE && (
            <span className="text-xs text-gray-400">로컬 테스트 모드</span>
          )}
        </div>
      </div>

      {/* 참가자 섹션 */}
      <div className="border-b border-gray-700">
        <ChatUserList />
      </div>

      {/* 에러/상태 배너 */}
      {invalidBanner}
      {!IS_TEST_MODE && !invalidRoomId && historyError && historyError.trim() !== '' && (
        <div className="bg-red-600/20 border border-red-600/50 text-red-200 p-2 mx-3 mt-2 rounded text-sm">
          ⚠️ {historyError}
        </div>
      )}
      {status === 'disconnected' && (
        <div className="bg-red-600/20 border border-red-600/50 text-red-200 p-2 mx-3 mt-2 rounded text-sm">
          🔴 연결이 끊어졌습니다
        </div>
      )}
      {status === 'reconnecting' && (
        <div className="bg-yellow-600/20 border border-yellow-600/50 text-yellow-200 p-2 mx-3 mt-2 rounded text-sm">
          🔄 재연결 중... ({reconnectAttempts}/5)
        </div>
      )}
      {status === 'failed' && (
        <div className="bg-red-600/20 border border-red-600/50 text-red-200 p-2 mx-3 mt-2 rounded text-sm">
          <div className="flex items-center justify-between">
            <span>❌ 연결 실패 - 네트워크를 확인해주세요</span>
            <button
              onClick={() => window.location.reload()}
              className="text-red-300 hover:text-red-100 text-xs underline"
            >
              새로고침
            </button>
          </div>
        </div>
      )}
      {!IS_TEST_MODE && !invalidRoomId && isInitialLoading && (
        <div className="bg-blue-600/20 text-blue-200 p-2 mx-3 mt-2 rounded text-sm text-center">
          📚 채팅 히스토리를 불러오는 중...
        </div>
      )}

      {/* 메시지 리스트 + 상단 더보기 */}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-3"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#4b5563 #2A2F46' }}
        onScroll={() => {
          const el = scrollContainerRef.current;
          if (!el || isLoadingHistory) return;
          if (isNearBottom(el) && showNewMessageButton) {
            setShowNewMessageButton(false);
            setNewMessageCount(0);
          }
        }}
      >
        {!IS_TEST_MODE && !invalidRoomId && isPaging && (
          <div className="text-center text-gray-400 text-xs py-2">
            📜 이전 메시지를 불러오는 중...
          </div>
        )}
        {!IS_TEST_MODE && !invalidRoomId && hasNext && !isPaging && !isInitialLoading && (
          <div className="text-center py-2">
            <button
              onClick={handleScrollTop}
              className="text-gray-400 hover:text-gray-300 underline text-xs"
            >
              이전 메시지 더 보기
            </button>
          </div>
        )}
        <ChatMessageList messages={filteredMessages} />
      </div>

      {/* 새 메시지 알림 버튼 */}
      {showNewMessageButton && (
        <div className="px-3 py-2 border-t border-gray-700 bg-[#1e2230]">
          <button
            onClick={() => {
              scrollToBottom();
              setShowNewMessageButton(false);
              setNewMessageCount(0);
            }}
            className="w-full bg-[#161929] hover:bg-gray-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <span>새 메시지 {newMessageCount}개 보기</span>
            <span className="text-lg">↓</span>
          </button>
        </div>
      )}

      {/* 입력창: 전송/연결상태를 내려줌(중복 연결 방지) */}
      <div className="border-t border-gray-700">
        <ChatInput
          tab="GROUP"
          preselectedReceiver=""
          onSend={sendGroupMessage}
          isConnected={status === 'connected' && !invalidRoomId}
        />
      </div>
    </div>
  );
}
