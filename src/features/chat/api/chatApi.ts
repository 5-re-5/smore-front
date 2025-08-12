import type { ChatMessage } from '@/shared/types/chatMessage.interface';

/* -------------------------------------------------
 * 환경 플래그
 * ------------------------------------------------- */
const USE_MOCK =
  import.meta.env.DEV || import.meta.env.VITE_STOMP_TEST_MODE === 'true';
// 성공(200) 이지만 응답이 비어있을 때, DEV/TEST에서만 mock으로 대체
const USE_MOCK_WHEN_EMPTY = USE_MOCK;

/* -------------------------------------------------
 * Mock 데이터 생성/저장소
 * ------------------------------------------------- */
const generateMockMessages = (count: number): ChatMessage[] => {
  const users = [
    { userId: 1, nickname: 'Alice', profileUrl: '/api/placeholder/32/32' },
    { userId: 2, nickname: 'Bob', profileUrl: '/api/placeholder/32/32' },
    { userId: 3, nickname: 'Charlie', profileUrl: '/api/placeholder/32/32' },
    { userId: 4, nickname: 'Diana', profileUrl: '/api/placeholder/32/32' },
    { userId: 5, nickname: 'Eve', profileUrl: '/api/placeholder/32/32' },
  ];

  const messageTypes = ['GROUP', 'SYSTEM', 'PRIVATE'] as const;
  const sampleMessages = [
    '안녕하세요! 잘 부탁드립니다.',
    '오늘 회의 시간이 언제인가요?',
    '자료 공유해드릴게요.',
    '수고하셨습니다!',
    '질문이 있는데 답변 부탁드려요.',
    '네, 확인했습니다.',
    '좋은 아이디어네요!',
    '내일 일정은 어떻게 되나요?',
    '파일 업로드 완료했습니다.',
    '회의 결과 정리해서 공유하겠습니다.',
    '프로젝트 진행상황 업데이트 드립니다.',
    '다음 단계로 넘어가도 될까요?',
    '테스트 결과가 나왔습니다.',
    '모두 수고 많으셨어요!',
    '추가 논의가 필요할 것 같습니다.',
  ];

  return Array.from({ length: count }, (_, index) => {
    const user = users[Math.floor(Math.random() * users.length)];
    const type = messageTypes[Math.floor(Math.random() * messageTypes.length)];
    const content =
      type === 'SYSTEM'
        ? `${user.nickname}님이 회의에 참여했습니다.`
        : sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

    const msg: ChatMessage = {
      type,
      sender: {
        userId: type === 'SYSTEM' ? null : user.userId,
        nickname: type === 'SYSTEM' ? 'SYSTEM' : user.nickname,
        profileUrl: type === 'SYSTEM' ? '' : user.profileUrl,
      },
      content,
      // 오래된 → 최신 순으로 2분 간격
      timestamp: new Date(Date.now() - (count - index) * 120000).toISOString(),
    };

    if (type === 'PRIVATE') {
      const otherUsers = users.filter((u) => u.userId !== user.userId);
      const receiver =
        otherUsers[Math.floor(Math.random() * otherUsers.length)];
      msg.receiver = receiver.userId.toString();
    }

    return msg;
  });
};

let mockMessagesStore: ChatMessage[] = [];

const initializeMockData = () => {
  if (!USE_MOCK) return; // 배포에서는 시드 금지
  if (mockMessagesStore.length === 0) {
    mockMessagesStore = generateMockMessages(75);
    console.log('🎭 Mock 데이터 초기화 완료:', mockMessagesStore.length, '개');
  }
};

/* -------------------------------------------------
 * 백엔드 응답/어댑터 타입
 * ------------------------------------------------- */
export interface BackendChatMessage {
  messageId: number;
  roomId: number;
  userId: number;
  content: string;
  type: string;
  createdAt: string;
  sender: {
    userId: number;
    nickname: string;
    profileUrl: string;
  };
  // 서버가 DM 수신자 정보를 줄 경우 여기에 receiverId 등을 추가해 매핑하세요.
}

export interface BackendChatResponse {
  data: {
    messages: BackendChatMessage[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalMessages: number;
      messagesPerPage: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    roomInfo: {
      roomId: number;
      title: string;
      currentParticipants: number;
    };
  };
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
  hasMore: boolean;
  currentPage?: number;
  totalCount: number;
  nextCursor?: string | null; // 커서 기반 전환 대비
}

const adaptChatMessage = (b: BackendChatMessage): ChatMessage => ({
  type: b.type as 'GROUP' | 'PRIVATE' | 'SYSTEM',
  sender: {
    userId: b.sender.userId,
    nickname: b.sender.nickname,
    profileUrl: b.sender.profileUrl,
  },
  content: b.content,
  timestamp: b.createdAt,
  // receiver: 서버가 내려주면 매핑
});

const adaptChatResponse = (r: BackendChatResponse): ChatHistoryResponse => ({
  messages: r.data.messages.map(adaptChatMessage),
  hasMore: r.data.pagination.hasNext,
  currentPage: r.data.pagination.currentPage,
  totalCount: r.data.pagination.totalMessages,
});

/* -------------------------------------------------
 * 전송 타입
 * ------------------------------------------------- */
export interface SendMessageRequest {
  type: 'GROUP' | 'PRIVATE' | 'SYSTEM';
  content: string;
  roomId: string;
  receiverId?: string;
}
export interface SendMessageResponse {
  success: boolean;
  messageId: string;
  timestamp: string;
}

/* -------------------------------------------------
 * Chat API
 * ------------------------------------------------- */
class ChatAPI {
  private baseUrl = `${import.meta.env.VITE_BACK_URL}`;

  initializeMockData() {
    initializeMockData();
  }

  /** 그룹/전체 히스토리: page=1이 ‘최신 limit개’ */
  async getChatHistory(
    roomId: string,
    page: number = 1,
    limit: number = 50,
    type: string = 'ALL',
  ): Promise<ChatHistoryResponse> {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        type,
      });

      const res = await fetch(
        `${this.baseUrl}/study-rooms/${roomId}/messages?${params}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const backend = (await res.json()) as BackendChatResponse;
      const adapted = adaptChatResponse(backend);

      // DEV/TEST에서 200인데 비어있으면 mock으로 대체
      if (USE_MOCK_WHEN_EMPTY && adapted.messages.length === 0) {
        throw new Error('Empty response in dev/test → fallback to mock');
      }

      return adapted;
    } catch (error) {
      console.error('채팅 히스토리 조회 실패:', error);

      // 배포에서는 mock 사용 금지 → 에러 전파
      if (!USE_MOCK) {
        throw error instanceof Error
          ? error
          : new Error('history fetch failed');
      }

      // ---- DEV/TEST: mock fallback ----
      if (mockMessagesStore.length === 0) initializeMockData();

      // 타입 필터링 (ALL: 전부, TEXT: GROUP+SYSTEM)
      let filtered = mockMessagesStore;
      if (type !== 'ALL') {
        filtered = filtered.filter((msg) =>
          type === 'TEXT'
            ? msg.type === 'GROUP' || msg.type === 'SYSTEM'
            : msg.type === type,
        );
      }

      // 오름차순 정렬(오래된→최신)
      const asc = filtered
        .slice()
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );

      // page=1이 ‘최신 limit개’가 되도록 뒤에서부터 슬라이스
      const total = asc.length;
      const endIndex = Math.max(0, total - (page - 1) * limit);
      const startIndex = Math.max(0, endIndex - limit);
      const messages =
        startIndex < endIndex ? asc.slice(startIndex, endIndex) : [];
      const hasMore = startIndex > 0;

      console.log('📚 Mock 히스토리(그룹) page:', {
        page,
        startIndex,
        endIndex,
        returned: messages.length,
        hasMore,
        total,
      });

      return { messages, hasMore, currentPage: page, totalCount: total };
    }
  }

  /** 개인(DM) 히스토리: page=1이 ‘최신 limit개’ */
  async getPrivateHistory(
    roomId: string,
    userId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<ChatHistoryResponse> {
    try {
      const params = new URLSearchParams({
        userId,
        page: String(page),
        limit: String(limit),
      });

      const res = await fetch(
        `${this.baseUrl}/rooms/${roomId}/private-history?${params}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const data = (await res.json()) as ChatHistoryResponse;

      if (
        USE_MOCK_WHEN_EMPTY &&
        (!data.messages || data.messages.length === 0)
      ) {
        throw new Error(
          'Empty private response in dev/test → fallback to mock',
        );
      }

      return data;
    } catch (error) {
      console.error('개인 채팅 히스토리 조회 실패:', error);

      // 배포에서는 mock 사용 금지 → 에러 전파
      if (!USE_MOCK) {
        throw error instanceof Error
          ? error
          : new Error('private history failed');
      }

      // ---- DEV/TEST: mock fallback ----
      if (mockMessagesStore.length === 0) initializeMockData();

      // ⚠️ 임시 현재 사용자 ID (실서버에서는 토큰에서 서버가 판별)
      const currentUserId = 3;
      const targetId = parseInt(userId, 10);

      // ‘나 ↔ 상대’ DM만 추출
      const onlyPair = mockMessagesStore.filter((m) => {
        if (m.type !== 'PRIVATE') return false;
        const s = m.sender?.userId ?? -1;
        const r = m.receiver ? parseInt(m.receiver, 10) : -1;
        return (
          (s === currentUserId && r === targetId) ||
          (s === targetId && r === currentUserId)
        );
      });

      // 오름차순 정렬
      const asc = onlyPair
        .slice()
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );

      const total = asc.length;
      const endIndex = Math.max(0, total - (page - 1) * limit);
      const startIndex = Math.max(0, endIndex - limit);
      const messages =
        startIndex < endIndex ? asc.slice(startIndex, endIndex) : [];
      const hasMore = startIndex > 0;

      console.log('📚 Mock 히스토리(개인) page:', {
        userId,
        page,
        startIndex,
        endIndex,
        returned: messages.length,
        hasMore,
        total,
      });

      return { messages, hasMore, currentPage: page, totalCount: total };
    }
  }

  /** (백업) HTTP 전송. 일반적으로는 STOMP 사용 */
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const res = await fetch(`${this.baseUrl}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  }

  /* 테스트/도우미 */
  resetMockData() {
    if (!USE_MOCK) return;
    mockMessagesStore = [];
    console.log('🔄 Mock 데이터 초기화됨');
  }
  addMockMessage(message: ChatMessage) {
    if (!USE_MOCK) return;
    if (!message.timestamp) message.timestamp = new Date().toISOString();
    mockMessagesStore.push(message);
    console.log('➕ Mock 메시지 추가됨. 총', mockMessagesStore.length, '개');
  }
}

/* -------------------------------------------------
 * 싱글톤 & 편의 export
 * ------------------------------------------------- */
export const chatApi = new ChatAPI();

export const getChatHistory = (
  roomId: string,
  page?: number,
  limit?: number,
  type?: string,
) => chatApi.getChatHistory(roomId, page, limit, type);

export const getPrivateHistory = (
  roomId: string,
  userId: string,
  page?: number,
  limit?: number,
) => chatApi.getPrivateHistory(roomId, userId, page, limit);

export const sendMessage = (request: SendMessageRequest) =>
  chatApi.sendMessage(request);

// 테스트용
export const resetMockChatData = () => chatApi.resetMockData();
export const addMockChatMessage = (message: ChatMessage) =>
  chatApi.addMockMessage(message);
