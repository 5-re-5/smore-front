/* eslint-disable @typescript-eslint/no-explicit-any */
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
import type { ChatMessage } from '@/shared/types/chatMessage.interface';

/* ------------------------------- 유틸 ------------------------------- */

const toNum = (v: unknown, fb = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
};

// 다양한 키를 허용해서 보낸 사람 정보 추출
function extractSender(
  raw: unknown,
): { userId: number; nickname: string; profileUrl: string | null } | null {
  const obj = raw as any;
  const cand =
    obj?.user ??
    obj?.sender ??
    obj?.author ??
    obj?.member ??
    obj?.writer ??
    null;

  const rootId = obj?.userId ?? obj?.uid ?? obj?.memberId ?? obj?.authorId;
  const rootNick = obj?.nickname ?? obj?.name ?? obj?.username;
  const rootAvatar = obj?.profileUrl ?? obj?.profileImageUrl ?? obj?.avatarUrl;

  if (cand && typeof cand === 'object') {
    const id =
      cand.userId ??
      cand.id ??
      cand.uid ??
      cand.memberId ??
      cand.authorId ??
      rootId;
    const nickname = cand.nickname ?? cand.name ?? cand.username ?? rootNick;
    const profileUrl =
      cand.profileUrl ?? cand.profileImageUrl ?? cand.avatarUrl ?? rootAvatar;
    if (id != null || nickname != null || profileUrl != null) {
      return {
        userId: toNum(id, 0),
        nickname: nickname ?? '알 수 없음',
        profileUrl: (profileUrl as string | undefined) ?? null,
      };
    }
  }

  if (rootId != null || rootNick != null || rootAvatar != null) {
    return {
      userId: toNum(rootId, 0),
      nickname: rootNick ?? '알 수 없음',
      profileUrl: (rootAvatar as string | undefined) ?? null,
    };
  }

  return null;
}

function normalizeMessageType(raw: unknown): 'CHAT' | 'SYSTEM' | 'PRIVATE' {
  const obj = raw as any;
  const t = String(obj?.messageType ?? obj?.type ?? 'CHAT').toUpperCase();
  if (t === 'GROUP') return 'CHAT'; // 레거시 호환
  return t === 'CHAT' || t === 'SYSTEM' || t === 'PRIVATE'
    ? (t as any)
    : 'CHAT';
}

function normalizeCreatedAt(raw: unknown): string {
  const obj = raw as any;
  const ts = obj?.createdAt ?? obj?.timestamp;
  if (typeof ts === 'string' && ts.length > 0) return ts;
  return new Date().toISOString();
}

/* ------------------------ 서버 원본 → 공용 메시지 ------------------------ */

export function normalizeHistoryItem(raw: unknown): ChatMessage {
  const obj = raw as any;
  const messageType = normalizeMessageType(raw);
  const createdAt = normalizeCreatedAt(raw);

  // SYSTEM은 user=null, sender.userId=null로 통일
  const s = extractSender(raw) ?? {
    userId: 0,
    nickname: 'SYSTEM',
    profileUrl: null,
  };
  const isSystem = messageType === 'SYSTEM' || s.userId === 0;

  return {
    /* ===== 신 스키마 ===== */
    messageId: typeof obj?.messageId === 'number' ? obj.messageId : undefined,
    clientMessageId: obj?.clientMessageId ?? undefined,
    roomId: obj?.roomId ?? undefined,
    user: isSystem
      ? null
      : {
          userId: s.userId,
          nickname: s.nickname,
          profileUrl: s.profileUrl ?? null,
        },
    content: String(obj?.content ?? ''),
    messageType,
    createdAt,
    isEdited: Boolean(obj?.isEdited),
    originalMessageId: obj?.originalMessageId ?? null,
    metadata: obj?.metadata ?? undefined,

    /* ===== 구 스키마(렌더 호환) ===== */
    type: messageType, // 'GROUP' 대신 'CHAT'로 통일
    sender: isSystem
      ? { userId: null, nickname: 'SYSTEM', profileUrl: '' }
      : {
          userId: s.userId,
          nickname: s.nickname,
          profileUrl: String(s.profileUrl ?? ''),
        },
    timestamp: createdAt,
    receiver: obj?.receiver ?? obj?.to ?? undefined,
  };
}

// 배열 정규화 + 오름차순 정렬(오래 → 최신)
export function normalizeHistoryArray(rawList: unknown[]): ChatMessage[] {
  const items = (rawList ?? []).map(normalizeHistoryItem);
  items.sort((a, b) => {
    const at = Date.parse((a.createdAt ?? a.timestamp ?? '') as string) || 0;
    const bt = Date.parse((b.createdAt ?? b.timestamp ?? '') as string) || 0;
    return at - bt;
  });
  return items;
}

/* ------------------------------- 훅 본문 ------------------------------- */

type Options = {
  pageSize?: number; // 기본 50
  autoInitial?: boolean; // true면 roomId 준비되자마자 1페이지 로드
  autoSinceOnReconnect?: boolean; // true면 'stomp:reconnected'에 since 동기화
  messageType?: ChatMessageType; // 서버 필터(선택)
};

function toPublicError(e: unknown): { public: string; code: string } {
  const err = e as { code?: string };
  const code: string = err?.code ?? 'UNKNOWN';
  switch (code) {
    case 'AUTH':
      return { public: '로그인이 필요합니다.', code };
    case 'NETWORK':
      return { public: '네트워크 상태를 확인해 주세요.', code };
    case 'SERVER':
      return {
        public: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        code,
      };
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
  console.log('🎪 useChatHistory 훅 호출됨:', {
    roomId,
    opts,
    timestamp: new Date().toISOString(),
  });

  const {
    pageSize = 50,
    autoInitial = true,
    autoSinceOnReconnect = true,
    messageType,
  } = opts;

  const mountedRef = useRef(true);
  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

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
  const serverCursorRef = useRef<
    { lastMessageId: number; lastCreatedAt: string } | undefined
  >(undefined);

  // 스토어 액션/상태
  const setStoreLoading = useChatMessageStore((s) => s.setLoading);
  const clearStore = useChatMessageStore((s) => s.clearMessages);
  const setAllMessages = useChatMessageStore((s) => s.setAllMessages);
  const addMessages = useChatMessageStore((s) => s.addMessages);
  const isHistoryLoaded = useChatMessageStore((s) => s.isHistoryLoaded);
  const messageCount = useChatMessageStore((s) => s.allMessages.length);

  // 같은 roomId로 이미 로드한 적이 있는지 추적
  const lastLoadedRoomIdRef = useRef<string | number | null>(null);

  // 의존성 값들을 별도로 로깅
  console.log('🔍 useEffect 의존성 값들:', {
    roomId,
    autoInitial,
    isHistoryLoaded,
    messageCount,
    'roomId 타입': typeof roomId,
    'roomId 값': roomId,
  });

  /** 초기 1페이지 로드 */
  const loadInitial = useCallback(async () => {
    console.log('🚀 loadInitial 호출됨:', {
      roomId,
      timestamp: new Date().toISOString(),
    });

    if (!roomId) return;

    // 이미 로딩 중이면 중복 호출 방지
    if (isInitialLoading) {
      console.log('⏸️ loadInitial 중복 호출 방지 - 이미 로딩 중');
      return;
    }

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

      // res.data가 undefined이므로 res를 직접 사용하되, 올바른 구조로 변환
      const responseData = res.data || res;
      const wrappedResponse = { data: responseData };
      const {
        items,
        hasNext: next,
        nextCursor,
      } = ingestHistoryResponse(wrappedResponse);

      // 디버깅: API 응답 전체 구조 확인
      console.log('📨 API 응답 전체 구조:', {
        fullResponse: res,
        resData: res.data,
        resDataKeys: Object.keys(res.data || {}),
        resDataType: typeof res.data,
      });

      // 디버깅: API 응답 처리
      console.log('📨 API 응답 처리:', {
        roomId,
        rawResponseContent: responseData?.content,
        rawContentLength: responseData?.content?.length,
        parsedItems: items,
        itemsCount: items.length,
        hasNext: next,
        nextCursor,
        firstRawItem: responseData?.content?.[0],
        firstParsedItem: items[0],
      });

      setAllMessages(items); // ✅ 스토어 반영

      // 디버깅: 스토어에 저장 후 상태 확인
      console.log('💾 스토어 저장 후:', {
        storeMessages: useChatMessageStore.getState().allMessages,
        storeCount: useChatMessageStore.getState().allMessages.length,
      });

      serverCursorRef.current = nextCursor ?? undefined;
      setHasNext(!!next);
      lastLoadedRoomIdRef.current = roomId; // ✅ 로드된 roomId 기록
    } catch (e: unknown) {
      // AbortController로 인한 취소는 에러로 처리하지 않음
      const err = e as { name?: string; message?: string };
      if (err.name === 'AbortError' || err.message?.includes('canceled')) {
        console.log('🔄 API 요청 취소됨 (정상)');
        return;
      }

      console.log('🚨 loadInitial 에러 발생:', e);
      const { public: msg } = toPublicError(e);
      setError(msg);
      if (import.meta.env.DEV)
        console.error('[useChatHistory] initial failed:', e);
    } finally {
      setIsInitialLoading(false);
      setStoreLoading?.(false);
    }
  }, [
    roomId,
    pageSize,
    messageType,
    isInitialLoading,
    setStoreLoading,
    setAllMessages,
  ]);

  /** 과거 페이지 로드 (상단 더보기) */
  const loadOlder = useCallback(async () => {
    if (!roomId) return;
    if (isPaging) return;
    if (isInitialLoading) return; // 초기 로딩 중일 때도 중복 방지

    // 커서 계산: 스토어의 가장 오래된 메시지 기준
    const cursor = getOlderCursorFromState();
    if (!cursor) {
      setHasNext(false);
      return;
    }

    // 디버깅: 커서 정보 확인
    console.log('🔍 loadOlder 커서 정보:', {
      cursor,
      lastCreatedAtType: typeof cursor.lastCreatedAt,
      lastCreatedAtValue: cursor.lastCreatedAt,
    });

    pagingAbortRef.current?.abort();
    pagingAbortRef.current = new AbortController();
    setIsPaging(true);
    setError(null);

    try {
      // lastCreatedAt을 ISO 형식으로 변환 (공백 → T)
      const isoCreatedAt = cursor.lastCreatedAt.replace(' ', 'T');

      // console.log('🌐 API 요청 파라미터:', {
      //   roomId,
      //   lastMessageId: cursor.lastMessageId,
      //   originalCreatedAt: cursor.lastCreatedAt,
      //   isoCreatedAt,
      //   encodedCreatedAt: encodeURIComponent(isoCreatedAt)
      // });

      const res = await fetchHistory({
        roomId,
        size: pageSize,
        lastMessageId: cursor.lastMessageId,
        lastCreatedAt: isoCreatedAt, // ISO 형식 사용
        messageType,
        signal: pagingAbortRef.current.signal,
      });

      // res.data가 undefined이므로 res를 직접 사용하되, 올바른 구조로 변환
      const responseData = res.data || res;
      const wrappedResponse = { data: responseData };
      const {
        items,
        hasNext: next,
        nextCursor,
      } = ingestHistoryResponse(wrappedResponse);
      addMessages(items, 'prepend'); // ✅ 과거 페이지는 앞쪽에 합치기

      serverCursorRef.current = nextCursor ?? serverCursorRef.current;
      setHasNext(!!next);
    } catch (e: unknown) {
      const { public: msg } = toPublicError(e);
      setError(msg); // 과거 로딩 실패는 사용자 메시지로만 보여주고 치명 X
      if (import.meta.env.DEV)
        console.error('[useChatHistory] loadOlder failed:', e);
    } finally {
      setIsPaging(false);
    }
  }, [roomId, pageSize, messageType, isPaging, isInitialLoading, addMessages]);

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
        since, // 서버는 strict '>' 비교 권장
        limit: pageSize,
        signal: syncAbortRef.current.signal,
      });
      ingestSinceResponse(res); // 내부에서 addMessages(mapped, 'append') 수행
    } catch (e: unknown) {
      if (import.meta.env.DEV)
        console.warn('[useChatHistory] syncSince failed:', e);
    } finally {
      setIsSyncing(false);
    }
  }, [roomId, pageSize, isSyncing]);

  /** 수동 초기화 + 초기 로드 재시작 (닫을 때는 호출하지 마세요) */
  const reset = useCallback(() => {
    console.log('🔄 reset 함수 호출됨');

    // 진행 중 요청 취소
    initialAbortRef.current?.abort();
    pagingAbortRef.current?.abort();
    syncAbortRef.current?.abort();

    // 스토어/상태 초기화
    clearStore();
    setHasNext(false);
    setError(null);

    // lastLoadedRoomId도 초기화해서 useEffect가 다시 실행되도록
    lastLoadedRoomIdRef.current = null;

    // 다시 초기 로드 (useEffect 의존성 변화를 기다리지 않고 직접 호출)
    if (roomId) {
      setTimeout(() => {
        if (mountedRef.current) {
          console.log('🔄 reset에서 loadInitial 직접 호출');
          loadInitial();
        }
      }, 0);
    }
  }, [clearStore, loadInitial, roomId]);

  /** roomId가 준비되면 자동 초기 로드 (이미 로드된 경우 건너뜀) */
  useEffect(() => {
    console.log('🔧 useChatHistory useEffect 실행:', {
      roomId,
      autoInitial,
      isHistoryLoaded,
      messageCount,
      deps: [roomId, autoInitial, isHistoryLoaded, messageCount],
    });

    if (!roomId) {
      console.log('❌ roomId 없음, 종료');
      return;
    }
    if (!autoInitial) {
      console.log('❌ autoInitial false, 종료');
      return;
    }

    // 같은 방이고, 이미 로드되어 있고, 메시지도 있으면 재요청 스킵
    // 단, 방이 바뀐 경우에는 항상 새로 로드
    if (
      isHistoryLoaded &&
      messageCount > 0 &&
      lastLoadedRoomIdRef.current === roomId
    ) {
      console.log('🔄 API 호출 스킵 - 이미 로드된 상태:', {
        roomId,
        isHistoryLoaded,
        messageCount,
        lastLoadedRoomId: lastLoadedRoomIdRef.current,
      });
      return;
    }

    console.log('🚀 API 호출 시작 - 새로운 로드:', {
      roomId,
      isHistoryLoaded,
      messageCount,
      lastLoadedRoomId: lastLoadedRoomIdRef.current,
    });

    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, autoInitial, isHistoryLoaded, messageCount]);

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
      error, // 사용자 친화 메시지
      loadInitial,
      loadOlder,
      syncSince,
      reset,
    }),
    [
      isInitialLoading,
      isPaging,
      isSyncing,
      hasNext,
      error,
      loadInitial,
      loadOlder,
      syncSince,
      reset,
    ],
  );
}
