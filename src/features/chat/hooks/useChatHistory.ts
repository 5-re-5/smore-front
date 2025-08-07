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

  // 페이지네이션 관리
  const cursorRef = useRef<string | undefined>(undefined);
  const isInitialLoadedRef = useRef(false);

  // 메시지 스토어
  const { setMessages, addMessages, clearMessages } = useChatMessageStore();

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
      console.log(`📚 초기 채팅 히스토리 로드 시작: ${roomId}`);

      const response: ChatHistoryResponse = await chatApi.getChatHistory(
        roomId,
        undefined,
        limit,
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

      // 스토어에 설정
      setMessages(sortedMessages);
      setHasMore(response.hasMore);
      setTotalCount(response.totalCount);
      cursorRef.current = response.nextCursor;
      isInitialLoadedRef.current = true;
    } catch (err) {
      handleError(err, '초기 히스토리 로드 실패');
      // 실패시 빈 배열로 초기화
      setMessages([]);
      setHasMore(false);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, limit, setMessages, handleError, isLoading]);

  // 더 많은 히스토리 로드 (무한 스크롤)
  const loadMoreHistory = useCallback(async () => {
    if (isLoadingMore || !hasMore || !cursorRef.current) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      console.log(`📚 추가 히스토리 로드: cursor=${cursorRef.current}`);

      const response: ChatHistoryResponse = await chatApi.getChatHistory(
        roomId,
        cursorRef.current,
        limit,
      );

      console.log(`📚 추가 히스토리 로드 완료: ${response.messages.length}개`);

      // 기존 메시지 앞에 추가 (오래된 메시지가 앞쪽에)
      const sortedNewMessages = response.messages.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );

      addMessages(sortedNewMessages, 'prepend'); // 앞쪽에 추가
      setHasMore(response.hasMore);
      cursorRef.current = response.nextCursor;
    } catch (err) {
      handleError(err, '추가 히스토리 로드 실패');
    } finally {
      setIsLoadingMore(false);
    }
  }, [roomId, limit, hasMore, isLoadingMore, addMessages, handleError]);

  // 개인 메시지 히스토리 로드
  const loadPrivateHistory = useCallback(
    async (userId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(`💬 개인 메시지 히스토리 로드: ${userId}`);

        const response: ChatHistoryResponse = await chatApi.getPrivateHistory(
          roomId,
          userId,
          undefined,
          limit,
        );

        console.log(
          `💬 개인 히스토리 로드 완료: ${response.messages.length}개`,
        );

        // 개인 메시지만 필터링하여 설정
        const privateMessages = response.messages.filter(
          (msg) => msg.type === 'PRIVATE',
        );
        const sortedMessages = privateMessages.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );

        setMessages(sortedMessages);
        setHasMore(response.hasMore);
        cursorRef.current = response.nextCursor;
      } catch (err) {
        handleError(err, '개인 히스토리 로드 실패');
        setMessages([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [roomId, limit, setMessages, handleError],
  );

  // 에러 클리어
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 새로고침 (처음부터 다시 로드)
  const refresh = useCallback(async () => {
    console.log('🔄 채팅 히스토리 새로고침');

    // 상태 초기화
    cursorRef.current = undefined;
    isInitialLoadedRef.current = false;
    setHasMore(true);
    setTotalCount(0);
    clearMessages();

    // 다시 로드
    await loadInitialHistory();
  }, [loadInitialHistory, clearMessages]);

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

export const usePrivateChatHistory = (roomId: string, userId: string) => {
  const chatHistory = useChatHistory({ roomId });

  // 자동으로 개인 히스토리 로드
  const loadHistory = useCallback(() => {
    return chatHistory.loadPrivateHistory(userId);
  }, [chatHistory, userId]);

  return {
    ...chatHistory,
    loadPrivateHistory: loadHistory,
  };
};
