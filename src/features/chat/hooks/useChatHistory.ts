import { useState, useCallback, useRef } from 'react';
import { chatApi, type ChatHistoryResponse } from '../api/chatApi';
import { useChatMessageStore } from '../model/useChatMessageStore';

interface UseChatHistoryOptions {
  roomId: string;
  limit?: number;
}

interface UseChatHistoryReturn {
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  totalCount: number;

  loadInitialHistory: () => Promise<void>;
  loadMoreHistory: () => Promise<void>;
  loadPrivateHistory: (userId: string) => Promise<void>;
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useChatHistory = ({
  roomId,
  limit = 50,
}: UseChatHistoryOptions): UseChatHistoryReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // 페이지네이션 관리 (cursor → page 기반)
  const currentPageRef = useRef<number>(1);
  const isInitialLoadedRef = useRef(false);

  // 메시지 스토어 - 전체 메시지 관리
  const { setAllMessages, addMessages, clearMessages, setHistoryLoaded } =
    useChatMessageStore();

  // 에러 처리 헬퍼
  const handleError = useCallback((err: unknown, context: string) => {
    const errorMessage =
      err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
    console.error(`[ChatHistory] ${context}:`, err);
    setError(`${context}: ${errorMessage}`);
  }, []);

  // 초기 히스토리 로드
  const loadInitialHistory = useCallback(async () => {
    if (isLoading || isInitialLoadedRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log(
        `📚 전체 채팅 히스토리 로드 시작: ${roomId} (모든 타입 포함)`,
      );

      // 모든 타입의 메시지를 가져오기 위해 'ALL' 사용
      const response: ChatHistoryResponse = await chatApi.getChatHistory(
        roomId,
        1, // 첫 페이지
        limit * 2, // 더 많은 메시지를 가져와서 클라이언트에서 필터링
        'ALL', // 모든 메시지 타입 포함
      );

      console.log(`📚 히스토리 로드 완료:`, {
        messagesCount: response.messages.length,
        hasMore: response.hasMore,
        totalCount: response.totalCount,
      });

      // 메시지를 시간순으로 정렬 (오래된 것부터)
      const sortedMessages = response.messages.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );

      // 스토어에 설정 - 전체 메시지 저장
      setAllMessages(sortedMessages);
      setHasMore(response.hasMore);
      setTotalCount(response.totalCount);
      currentPageRef.current = response.currentPage || 1;
      isInitialLoadedRef.current = true;
    } catch (err) {
      handleError(err, '초기 히스토리 로드 실패');
      // 실패시 빈 배열로 초기화
      setAllMessages([]);
      setHasMore(false);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, limit, setAllMessages, handleError, isLoading]);

  // 더 많은 히스토리 로드 (페이지 기반)
  const loadMoreHistory = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const nextPage = currentPageRef.current + 1;
      console.log(`📚 추가 히스토리 로드: page=${nextPage}`);

      const response: ChatHistoryResponse = await chatApi.getChatHistory(
        roomId,
        nextPage,
        limit * 2, // 더 많은 메시지를 가져와서 클라이언트에서 필터링
        'ALL', // 모든 타입 포함
      );

      console.log(`📚 추가 히스토리 로드 완료: ${response.messages.length}개`);

      // 기존 메시지 앞에 추가 (과거 메시지가 상단에)
      const sortedNewMessages = response.messages.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );

      addMessages(sortedNewMessages, 'prepend'); // 앞쪽에 추가
      setHasMore(response.hasMore);
      currentPageRef.current = response.currentPage || currentPageRef.current;
    } catch (err) {
      handleError(err, '추가 히스토리 로드 실패');
    } finally {
      setIsLoadingMore(false);
    }
  }, [roomId, limit, hasMore, isLoadingMore, addMessages, handleError]);

  // 개인 메시지 히스토리 로드 - 더 이상 사용하지 않음 (클라이언트 사이드 필터링 사용)
  const loadPrivateHistory = useCallback(async (userId: string) => {
    // 이제 별도 API 호출 없이 클라이언트 사이드에서 필터링
    console.log(`💬 개인 메시지 필터링: ${userId} (클라이언트 사이드)`);
    // 아무것도 하지 않음 - ChatPanel에서 필터링 수행
    return Promise.resolve();
  }, []);

  // 에러 클리어
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 새로고침 (처음부터 다시 로드)
  const refresh = useCallback(async () => {
    console.log('🔄 채팅 히스토리 새로고침');

    // 상태 초기화
    currentPageRef.current = 1;
    isInitialLoadedRef.current = false;
    setHasMore(true);
    setTotalCount(0);
    clearMessages();
    setHistoryLoaded(false);

    // 다시 로드
    await loadInitialHistory();
  }, [loadInitialHistory, clearMessages, setHistoryLoaded]);

  return {
    // 상태
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    totalCount,

    // 액션
    loadInitialHistory,
    loadMoreHistory,
    loadPrivateHistory,
    clearError,
    refresh,
  };
};

// 편의 훅들
export const useRoomChatHistory = (roomId: string) => {
  return useChatHistory({ roomId });
};

// 더 이상 사용하지 않음 - 클라이언트 사이드 필터링으로 대체
export const usePrivateChatHistory = (roomId: string, userId: string) => {
  const chatHistory = useChatHistory({ roomId });

  return {
    ...chatHistory,
    // loadPrivateHistory는 더 이상 API 호출을 하지 않음
    loadPrivateHistory: () => Promise.resolve(),
  };
};
