import { useState, useCallback, useRef } from 'react';
import { chatApi, type ChatHistoryResponse } from '../api/chatApi';
import { useChatMessageStore } from '../model/useChatMessageStore';

interface UseChatHistoryOptions {
  roomId: string;
  limit?: number;
}
export interface UseChatHistoryReturn {
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;

  // 🔹 분리된 hasMore
  hasMoreGroup: boolean;
  hasMorePrivate: Record<string, boolean>;

  // (선택) 통계
  totalCountGroup: number;
  totalCountPrivate: Record<string, number>;

  // 🔹 그룹/개인별 로드
  loadInitialGroup: () => Promise<void>;
  loadMoreGroup: () => Promise<void>;

  loadInitialPrivate: (userId: string) => Promise<void>;
  loadMorePrivate: (userId: string) => Promise<void>;

  clearError: () => void;
  refreshAll: () => Promise<void>;
}

export const useChatHistory = ({
  roomId,
  limit = 50,
}: UseChatHistoryOptions): UseChatHistoryReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 그룹
  const [hasMoreGroup, setHasMoreGroup] = useState(true);
  const [totalCountGroup, setTotalCountGroup] = useState(0);
  const currentPageGroupRef = useRef(1);

  // 🔹 개인 (userId별)
  const [hasMorePrivate, setHasMorePrivate] = useState<Record<string, boolean>>(
    {},
  );
  const [totalCountPrivate, setTotalCountPrivate] = useState<
    Record<string, number>
  >({});
  const privatePageRef = useRef<Record<string, number>>({}); // userId -> page

  const isInitialGroupLoadedRef = useRef(false);

  const { setAllMessages, addMessages, setHistoryLoaded } =
    useChatMessageStore();

  const handleError = useCallback((err: unknown, ctx: string) => {
    const msg = err instanceof Error ? err.message : '알 수 없는 오류';
    console.error(`[ChatHistory] ${ctx}:`, err);
    setError(`${ctx}: ${msg}`);
  }, []);

  // ✅ 그룹 초기 로드
  const loadInitialGroup = useCallback(async () => {
    if (isLoading || isInitialGroupLoadedRef.current) return;
    setIsLoading(true);
    setError(null);

    try {
      const res: ChatHistoryResponse = await chatApi.getChatHistory(
        roomId,
        1,
        limit,
        'ALL',
      );
      const asc = res.messages
        .slice()
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );

      setAllMessages(asc);
      setHistoryLoaded(true);

      setHasMoreGroup(res.hasMore ?? res.totalCount > asc.length);
      setTotalCountGroup(res.totalCount);
      currentPageGroupRef.current = res.currentPage || 1;
      isInitialGroupLoadedRef.current = true;
    } catch (e) {
      handleError(e, '그룹 초기 로드 실패');
      // setAllMessages([]);
      setHasMoreGroup(false);
      setTotalCountGroup(0);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, limit, isLoading, setAllMessages, setHistoryLoaded, handleError]);

  // ✅ 그룹 더보기
  const loadMoreGroup = useCallback(async () => {
    if (isLoadingMore || !hasMoreGroup) return;
    setIsLoadingMore(true);
    setError(null);

    try {
      const next = currentPageGroupRef.current + 1;
      const res = await chatApi.getChatHistory(roomId, next, limit, 'ALL');

      const asc = res.messages
        .slice()
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );
      addMessages(asc, 'prepend'); // 과거를 위에 붙임
      setHasMoreGroup(res.hasMore);
      currentPageGroupRef.current = res.currentPage || next;
    } catch (e) {
      handleError(e, '그룹 더보기 실패');
    } finally {
      setIsLoadingMore(false);
    }
  }, [roomId, limit, hasMoreGroup, isLoadingMore, addMessages, handleError]);

  // ✅ 개인 초기 로드 (userId별)
  const loadInitialPrivate = useCallback(
    async (userId: string) => {
      if (!userId) return;
      if (privatePageRef.current[userId]) return; // 이미 로드됨(최초 페이지)

      setIsLoading(true);
      setError(null);
      try {
        const res = await chatApi.getPrivateHistory(roomId, userId, 1, limit);

        const asc = res.messages
          .slice()
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          );
        addMessages(asc, 'prepend'); // 스토어 전체에 합류 (중복은 addMessages에서 제거되도록)

        setHasMorePrivate((prev) => ({ ...prev, [userId]: !!res.hasMore }));
        setTotalCountPrivate((prev) => ({
          ...prev,
          [userId]: res.totalCount ?? asc.length,
        }));
        privatePageRef.current[userId] = res.currentPage || 1;
      } catch (e) {
        handleError(e, `개인(${userId}) 초기 로드 실패`);
      } finally {
        setIsLoading(false);
      }
    },
    [roomId, limit, addMessages, handleError],
  );

  // ✅ 개인 더보기 (userId별)
  const loadMorePrivate = useCallback(
    async (userId: string) => {
      if (!userId) return;
      if (isLoadingMore || !hasMorePrivate[userId]) return;

      setIsLoadingMore(true);
      setError(null);
      try {
        const next = (privatePageRef.current[userId] ?? 1) + 1;
        const res = await chatApi.getPrivateHistory(
          roomId,
          userId,
          next,
          limit,
        );

        const asc = res.messages
          .slice()
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          );
        addMessages(asc, 'prepend');

        setHasMorePrivate((prev) => ({ ...prev, [userId]: !!res.hasMore }));
        privatePageRef.current[userId] = res.currentPage || next;
      } catch (e) {
        handleError(e, `개인(${userId}) 더보기 실패`);
      } finally {
        setIsLoadingMore(false);
      }
    },
    [roomId, limit, isLoadingMore, hasMorePrivate, addMessages, handleError],
  );

  const clearError = useCallback(() => setError(null), []);

  // 전체 초기화 후 다시 그룹 1페이지
  // ✅ 탭/상대 옵션을 받아서 적절히 초기 로드
  const refreshAll = useCallback(
    async (opts?: {
      activeTab?: 'GROUP' | 'PRIVATE';
      selectedPrivateUserId?: string;
    }) => {
      // ✅ 커서/플래그 리셋 (메시지는 비우지 않음)
      currentPageGroupRef.current = 1;
      privatePageRef.current = {};
      isInitialGroupLoadedRef.current = false; // ★ 중요
      setHasMoreGroup(true);
      setHasMorePrivate({});
      setTotalCountGroup(0);
      setTotalCountPrivate({});
      setError(null);
      setHistoryLoaded(false);

      try {
        // 그룹 1페이지
        await loadInitialGroup();

        // PRIVATE 탭이라면 현재 상대도 즉시 초기 로드
        if (opts?.activeTab === 'PRIVATE' && opts.selectedPrivateUserId) {
          await loadInitialPrivate(opts.selectedPrivateUserId);
        }
      } catch (e) {
        // 실패 시 기존 메시지를 유지 → 배너만 노출
        // (여기서는 추가 조치 불필요; setError는 내부 load 함수가 이미 처리)
      }
    },
    [loadInitialGroup, loadInitialPrivate, setHistoryLoaded],
  );

  return {
    isLoading,
    isLoadingMore,
    error,

    hasMoreGroup,
    hasMorePrivate,

    totalCountGroup,
    totalCountPrivate,

    loadInitialGroup,
    loadMoreGroup,

    loadInitialPrivate,
    loadMorePrivate,

    clearError,
    refreshAll,
  };
};
