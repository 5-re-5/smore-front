import { useState, useEffect, useRef, useCallback } from 'react';
import ChatUserList from '@/features/chat/ui/ChatUserList';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { useChatMessageStore } from '../model/useChatMessageStore';
import { useChatHistory } from '../hooks/useChatHistory';
import { useRoomContext, useParticipants } from '@livekit/components-react';
import { useUserStore } from '@/entities/user/model/useUserStore';
import { useStompChat } from '../hooks/useStompChat';

interface ChatPanelProps {
  isOpen?: boolean;
}

export default function ChatPanel({ isOpen }: ChatPanelProps = {}) {
  const [tab, setTab] = useState<'GROUP' | 'PRIVATE'>('GROUP');
  const [selectedPrivateUserId, setSelectedPrivateUserId] =
    useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [roomIdLoading, setRoomIdLoading] = useState(true);
  const { connectionStatus, reconnectAttempts } = useStompChat();

  // 스크롤 관리를 위한 상태
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTopRef = useRef(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<string>('');
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);

  // 스토어 및 훅들
  const { messages } = useChatMessageStore();
  const { userId: currentUserId } = useUserStore();
  const room = useRoomContext();
  const participants = useParticipants();

  // Mock 데이터 초기화 (컴포넌트 마운트 시 한 번만)
  useEffect(() => {
    import('../api/chatApi').then(({ chatApi }) => {
      chatApi.initializeMockData();
    });
  }, []);

  // Room ID 가져오기 (getSid 사용)
  useEffect(() => {
    const getRoomId = async () => {
      if (!room) return;

      try {
        const sid = await room.getSid();
        // console.log('🎯 서버 할당 Room SID:', sid);
        setRoomId(sid);
      } catch (error) {
        console.warn('⚠️ getSid 실패, name 사용:', error);
        setRoomId(room.name || 'default-room');
      } finally {
        setRoomIdLoading(false);
      }
    };

    getRoomId();
  }, [room]);

  // 채팅 히스토리 관리
  const {
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    totalCount,
    loadInitialHistory,
    loadMoreHistory,
    loadPrivateHistory,
    clearError,
    refresh,
  } = useChatHistory({ roomId, limit: 50 });

  // Room ID가 준비되면 히스토리 로드
  useEffect(() => {
    if (!roomIdLoading && roomId) {
      loadInitialHistory();
    }
  }, [roomId, roomIdLoading, loadInitialHistory]);

  // 채팅창이 열릴 때 자동 스크롤 (scrollToBottom 함수 정의 후에 위치)

  // 탭 변경시 처리
  const handleTabChange = async (newTab: 'GROUP' | 'PRIVATE') => {
    setTab(newTab);
    setShowNewMessageButton(false); // 버튼 숨기기
    setNewMessageCount(0); // 카운트 리셋

    if (newTab === 'GROUP') {
      setSelectedPrivateUserId('');
      await loadInitialHistory();
    } else {
      setSelectedPrivateUserId('');
    }

    // 탭 변경 후 자동 스크롤
    setTimeout(() => scrollToBottom(true), 100);
  };

  // 개인 대화 상대 변경시 처리
  const handlePrivateUserChange = async (userId: string) => {
    // console.log(`👤 개인 대화 상대 변경: ${selectedPrivateUserId} → ${userId}`);
    setSelectedPrivateUserId(userId);
    setShowNewMessageButton(false); // 버튼 숨기기
    setNewMessageCount(0); // 카운트 리셋
    if (userId) {
      await loadPrivateHistory(userId);
    } else {
      await loadInitialHistory();
    }

    // 대화 상대 변경 후 자동 스크롤
    setTimeout(() => scrollToBottom(true), 100);
  };

  // 새 메시지 보기 버튼 클릭 핸들러
  const handleViewNewMessages = () => {
    // console.log('📨 새 메시지 보기 버튼 클릭');
    scrollToBottom();
    setShowNewMessageButton(false);
    setNewMessageCount(0);
  };

  // 현재 탭에 맞게 메시지 필터링
  const filteredMessages = messages.filter((msg) => {
    if (tab === 'GROUP') {
      return msg.type === 'GROUP' || msg.type === 'SYSTEM';
    } else if (tab === 'PRIVATE') {
      if (msg.type !== 'PRIVATE') return false;

      if (!selectedPrivateUserId) {
        return true;
      }

      const isFromSelected =
        msg.sender.userId?.toString() === selectedPrivateUserId;
      const isToSelected = msg.receiver === selectedPrivateUserId;
      const isFromMe =
        msg.sender.userId?.toString() === currentUserId?.toString();
      const isToMe = msg.receiver === currentUserId?.toString();

      return (isFromSelected && isToMe) || (isFromMe && isToSelected);
    }
    return false;
  });

  // 선택 가능한 참가자 목록
  const selectableParticipants = participants
    .filter((p) => !p.isLocal)
    .map((p) => {
      try {
        const data = JSON.parse(p.metadata || '{}');
        return {
          id: data.uid?.toString() || p.sid,
          name: data.nickname || p.identity,
        };
      } catch {
        return {
          id: p.sid,
          name: p.identity,
        };
      }
    });

  // 하단 근처 여부 확인 함수
  const isNearBottom = useCallback((element: HTMLElement, threshold = 100) => {
    return (
      element.scrollHeight - element.scrollTop - element.clientHeight <=
      threshold
    );
  }, []);

  // 자동 스크롤 실행 함수
  const scrollToBottom = useCallback((smooth = true) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // 과거 메시지 로딩 중에는 무시
    if (isLoadingHistory) {
      return;
    }

    const nearBottom = isNearBottom(container);

    // 하단에 도달하면 새 메시지 버튼 숨기기
    if (nearBottom && showNewMessageButton) {
      setShowNewMessageButton(false);
      setNewMessageCount(0);
      // console.log('📨 하단 도달 - 새 메시지 버튼 숨김');
    }

    lastScrollTopRef.current = container.scrollTop;
  }, [isLoadingHistory, showNewMessageButton, isNearBottom]);

  // 새 메시지 감지 및 처리
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || filteredMessages.length === 0) return;

    // 과거 메시지 로딩 중이면 무시
    if (isLoadingMore || isLoading || isLoadingHistory) {
      return;
    }

    const currentLastMessage = filteredMessages[filteredMessages.length - 1];
    const currentLastMessageTimestamp = currentLastMessage?.timestamp || '';

    // 새 메시지가 뒤에 추가되었는지 확인
    const isNewMessageAtEnd =
      currentLastMessageTimestamp !== lastMessageTimestamp &&
      lastMessageTimestamp !== '';

    if (isNewMessageAtEnd) {
      // console.log('📨 새 메시지 감지');

      if (isNearBottom(container)) {
        // 하단에 있으면 자동 스크롤
        scrollToBottom();
      } else {
        // 하단에 없으면 새 메세지 버튼 표시
        setNewMessageCount((prev) => prev + 1);
        setShowNewMessageButton(true);
      }
    }

    // 마지막 메시지 timestamp 업데이트
    setLastMessageTimestamp(currentLastMessageTimestamp);
  }, [
    filteredMessages.length,
    isNearBottom,
    isLoadingMore,
    isLoading,
    isLoadingHistory,
    lastMessageTimestamp,
    scrollToBottom,
  ]);

  // 채팅창이 열릴 때 자동 스크롤
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => scrollToBottom(true), 200);
    }
  }, [isOpen, scrollToBottom]);

  const handleScrollTop = () => {
    if (!isLoadingMore && hasMore) {
      console.log('📜 더보기 버튼 클릭');
      setIsLoadingHistory(true);

      const container = scrollContainerRef.current;
      if (container) {
        const prevScrollHeight = container.scrollHeight;
        const prevScrollTop = container.scrollTop;

        loadMoreHistory().then(() => {
          requestAnimationFrame(() => {
            if (container) {
              const newScrollHeight = container.scrollHeight;
              const heightDiff = newScrollHeight - prevScrollHeight;
              // 스크롤 위치 복원 (사용자가 보던 위치 유지)
              container.scrollTop = prevScrollTop + heightDiff;
              // console.log('📜 스크롤 위치 복원:', { prevScrollTop, heightDiff, newScrollTop: prevScrollTop + heightDiff });
            }
            setIsLoadingHistory(false);
            // console.log('📜 더보기 완료');
          });
        });
      }
    }
  };
  // Room ID 로딩 중일 때
  if (roomIdLoading) {
    return (
      <div className="flex flex-col h-full bg-[#1e2230] text-white rounded-lg overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-sm">채팅방 정보를 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-80 bg-[#1e2230] text-white rounded-lg overflow-hidden">
      {/* Header with Stats */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">
            참가자({participants.length})
          </span>
          {totalCount > 0 && (
            <span className="text-xs text-gray-400">
              • 메시지 {totalCount}개
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-700"
            disabled={isLoading}
          >
            {isLoading ? '로딩...' : '새로고침'}
          </button>
        </div>
      </div>

      {/* 참가자 섹션 */}
      <div className="border-b border-gray-700">
        <ChatUserList />
      </div>

      {/* 채팅 탭 */}
      <div className="flex justify-center gap-4 py-2 border-b border-gray-700">
        <button
          onClick={() => handleTabChange('GROUP')}
          className={`px-4 py-1 rounded-full text-sm ${
            tab === 'GROUP'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
          disabled={isLoading}
        >
          전체
        </button>
        <button
          onClick={() => handleTabChange('PRIVATE')}
          className={`px-4 py-1 rounded-full text-sm ${
            tab === 'PRIVATE'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
          disabled={isLoading}
        >
          개인
        </button>
      </div>

      {/* 개인 탭일 때만 사용자 선택 드롭다운 */}
      {tab === 'PRIVATE' && (
        <div className="border-b border-gray-700 p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 whitespace-nowrap">
              대화 상대:
            </span>
            <select
              value={selectedPrivateUserId}
              onChange={(e) => handlePrivateUserChange(e.target.value)}
              className="flex-1 bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="">모든 개인 메시지</option>
              {selectableParticipants.map((participant) => (
                <option key={participant.id} value={participant.id}>
                  {participant.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-gray-500 mt-1">
            {selectedPrivateUserId
              ? `${selectableParticipants.find((p) => p.id === selectedPrivateUserId)?.name}와의 대화`
              : '모든 개인 메시지를 표시중'}
          </div>
        </div>
      )}

      {/* 에러 표시 */}
      {error && (
        <div className="bg-red-600/20 border border-red-600/50 text-red-200 p-2 mx-3 mt-2 rounded text-sm">
          <div className="flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button
              onClick={clearError}
              className="text-red-300 hover:text-red-100 text-xs underline"
            >
              닫기
            </button>
          </div>
        </div>
      )}
      {connectionStatus === 'disconnected' && (
        <div className="bg-red-600/20 border border-red-600/50 text-red-200 p-2 mx-3 mt-2 rounded text-sm">
          🔴 연결이 끊어졌습니다
        </div>
      )}
      {connectionStatus === 'reconnecting' && (
        <div className="bg-yellow-600/20 border border-yellow-600/50 text-yellow-200 p-2 mx-3 mt-2 rounded text-sm">
          🔄 재연결 중... ({reconnectAttempts}/5)
        </div>
      )}
      {connectionStatus === 'failed' && (
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
      {/* 로딩 표시 */}
      {isLoading && (
        <div className="bg-blue-600/20 text-blue-200 p-2 mx-3 mt-2 rounded text-sm text-center">
          📚 채팅 히스토리를 불러오는 중...
        </div>
      )}

      {/* 메시지 목록 */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-3"
        onScroll={handleScroll}
      >
        {isLoadingMore && (
          <div className="text-center text-gray-400 text-xs py-2">
            📜 이전 메시지를 불러오는 중...
          </div>
        )}

        {hasMore && !isLoadingMore && !isLoading && (
          <div className="text-center py-2">
            <button
              onClick={handleScrollTop}
              className="text-gray-400 hover:text-gray-300 underline text-xs"
            >
              이전 메시지 더 보기
            </button>
          </div>
        )}

        <ChatMessageList
          messages={filteredMessages}
          isLoadingHistory={isLoadingHistory}
        />
      </div>
      {/* 새 메시지 알림 버튼 */}
      {showNewMessageButton && (
        <div className="px-3 py-2 border-t border-gray-700 bg-[#1e2230]">
          <button
            onClick={handleViewNewMessages}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <span>새 메시지 {newMessageCount}개 보기</span>
            <span className="text-lg">↓</span>
          </button>
        </div>
      )}
      {/* 입력창 */}
      <div className="border-t border-gray-700">
        <ChatInput tab={tab} preselectedReceiver={selectedPrivateUserId} />
      </div>
    </div>
  );
}
