// features/chat/lib/useChatHistory.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchHistory, fetchSince } from '@/features/chat/api/chatHttp';
import {
  ingestHistoryResponse,
  ingestSinceResponse,
  getOlderCursorFromState,
  getSinceFromState,
} from '@/features/chat/lib/ingest';
import { useChatMessageStore } from '@/features/chat/model/useChatMessageStore';
import type { ChatMessageType } from '@/shared/types/chat';

type Options = {
  pageSize?: number;               // 기본 50
  autoInitial?: boolean;           // true면 roomId 준비되자마자 1페이지 로드
  autoSinceOnReconnect?: boolean;  // true면 'stomp:reconnected'에 since 동기화
  messageType?: ChatMessageType;   // 서버 필터(선택)
};

function toPublicError(e: any): { public: string; code: string } {
  const code: string = e?.code ?? 'UNKNOWN';
  switch (code) {
    case 'AUTH':
      return { public: '로그인이 필요합니다.', code };
    case 'NETWORK':
      return { public: '네트워크 상태를 확인해 주세요.', code };
    case 'SERVER':
      return { public: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', code };
    case 'NON_JSON':
      return { public: '다시 시도해 주세요.', code };
    default:
      return { public: '메시지 이력을 불러오지 못했습니다.', code };
  }
}

export function useChatHistory(
  roomId: string | number | null | undefined,
  opts: Options = {},
) {
  const {
    pageSize = 50,
    autoInitial = true,
    autoSinceOnReconnect = true,
    messageType,
  } = opts;

  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  // 상태
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isPaging, setIsPaging] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 진행 중 요청 취소용
  const initialAbortRef = useRef<AbortController | null>(null);
  const pagingAbortRef = useRef<AbortController | null>(null);
  const syncAbortRef = useRef<AbortController | null>(null);

  // 서버가 준 nextCursor를 저장(키셋)
  const serverCursorRef = useRef<{ lastMessageId: number; lastCreatedAt: string } | undefined>(undefined);

  // (선택) 스토어의 로딩 상태도 맞춰주고 싶으면 사용
  const setStoreLoading = useChatMessageStore((s) => s.setLoading);
  const clearStore = useChatMessageStore((s) => s.clearMessages);

  /** 초기 1페이지 로드 */
  const loadInitial = useCallback(async () => {
    if (!roomId) return;
    // 이전 초기 요청 취소
    initialAbortRef.current?.abort();
    initialAbortRef.current = new AbortController();

    setIsInitialLoading(true);
    setError(null);
    setStoreLoading?.(true);

    try {
      const res = await fetchHistory({
        roomId,
        size: pageSize,
        messageType,
        signal: initialAbortRef.current.signal,
      });
      const { hasNext: next, nextCursor } = ingestHistoryResponse(res, 'initial');
      serverCursorRef.current = nextCursor ?? undefined;
      setHasNext(!!next);
    } catch (e: any) {
      const { public: msg } = toPublicError(e);
      setError(msg); // 사용자에겐 짧은 안내만
      if (import.meta.env.DEV) console.error('[useChatHistory] initial failed:', e);
    } finally {
      setIsInitialLoading(false);
      setStoreLoading?.(false);
    }
  }, [roomId, pageSize, messageType, setStoreLoading]);

  /** 과거 페이지 로드 (상단 더보기) */
  const loadOlder = useCallback(async () => {
    if (!roomId) return;
    if (isPaging) return;

    // 커서 계산: 스토어의 가장 오래된 메시지 기준
    const cursor = getOlderCursorFromState();
    if (!cursor) {
      setHasNext(false);
      return;
    }

    pagingAbortRef.current?.abort();
    pagingAbortRef.current = new AbortController();
    setIsPaging(true);
    setError(null);

    try {
      const res = await fetchHistory({
        roomId,
        size: pageSize,
        lastMessageId: cursor.lastMessageId,
        lastCreatedAt: cursor.lastCreatedAt,
        messageType,
        signal: pagingAbortRef.current.signal,
      });
      const { hasNext: next, nextCursor } = ingestHistoryResponse(res, 'older');
      serverCursorRef.current = nextCursor ?? serverCursorRef.current;
      setHasNext(!!next);
    } catch (e: any) {
      const { public: msg } = toPublicError(e);
      // 과거 로딩 실패는 치명적이 아님: 사용자에겐 짧게만
      setError(msg);
      if (import.meta.env.DEV) console.error('[useChatHistory] loadOlder failed:', e);
    } finally {
      setIsPaging(false);
    }
  }, [roomId, pageSize, messageType, isPaging]);

  /** 재연결 이후 누락분 동기화 */
  const syncSince = useCallback(async () => {
    if (!roomId) return;
    if (isSyncing) return;

    const since = getSinceFromState();
    if (!since) return;

    syncAbortRef.current?.abort();
    syncAbortRef.current = new AbortController();
    setIsSyncing(true);

    try {
      const res = await fetchSince({
        roomId,
        since,               // 서버는 strict '>' 비교 권장
        limit: pageSize,
        signal: syncAbortRef.current.signal,
      });
      ingestSinceResponse(res);
    } catch (e: any) {
      // 동기화 실패는 조용히 로그만 남겨도 됨
      if (import.meta.env.DEV) console.warn('[useChatHistory] syncSince failed:', e);
    } finally {
      setIsSyncing(false);
    }
  }, [roomId, pageSize, isSyncing]);

  /** 수동 초기화 + 초기 로드 재시작 */
  const reset = useCallback(() => {
    // 진행 중 요청 취소
    initialAbortRef.current?.abort();
    pagingAbortRef.current?.abort();
    syncAbortRef.current?.abort();

    // 스토어/상태 초기화
    clearStore();
    setHasNext(false);
    setError(null);

    // 다시 초기 로드
    if (roomId) {
      // 약간의 지연으로 렌더 안정화
      setTimeout(() => {
        if (mountedRef.current) loadInitial();
      }, 0);
    }
  }, [clearStore, loadInitial, roomId]);

  /** roomId가 준비되면 자동 초기 로드 */
  useEffect(() => {
    if (!roomId) return;
    if (!autoInitial) return;
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, autoInitial]);

  /** 재연결 이벤트 → since 동기화 */
  useEffect(() => {
    if (!autoSinceOnReconnect) return;
    const handler = () => {
      if (!mountedRef.current) return;
      syncSince();
    };
    window.addEventListener('stomp:reconnected', handler);
    return () => window.removeEventListener('stomp:reconnected', handler);
  }, [autoSinceOnReconnect, syncSince]);

  /** 언마운트 시 요청 취소 */
  useEffect(() => {
    return () => {
      initialAbortRef.current?.abort();
      pagingAbortRef.current?.abort();
      syncAbortRef.current?.abort();
    };
  }, []);

  return useMemo(
    () => ({
      isInitialLoading,
      isPaging,
      isSyncing,
      hasNext,
      error,          // 사용자 친화 메시지
      loadInitial,
      loadOlder,
      syncSince,
      reset,
    }),
    [isInitialLoading, isPaging, isSyncing, hasNext, error, loadInitial, loadOlder, syncSince, reset],
  );
}
