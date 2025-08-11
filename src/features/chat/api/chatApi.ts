import type { ChatMessage } from '@/shared/types/chatMessage.interface';
// Mock 데이터 생성 함수 추가
const generateMockMessages = (count: number): ChatMessage[] => {
  const users = [
    { userId: 1, nickname: 'Alice', profileUrl: '/api/placeholder/32/32' },
    { userId: 2, nickname: 'Bob', profileUrl: '/api/placeholder/32/32' },
    { userId: 3, nickname: 'Charlie', profileUrl: '/api/placeholder/32/32' },
    { userId: 4, nickname: 'Diana', profileUrl: '/api/placeholder/32/32' },
    { userId: 5, nickname: 'Eve', profileUrl: '/api/placeholder/32/32' },
  ];

  const messageTypes = ['GROUP', 'SYSTEM'] as const;
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
    const messageType =
      messageTypes[Math.floor(Math.random() * messageTypes.length)];
    const content =
      messageType === 'SYSTEM'
        ? `${user.nickname}님이 회의에 참여했습니다.`
        : sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

    return {
      type: messageType,
      sender: {
        userId: messageType === 'SYSTEM' ? null : user.userId,
        nickname: messageType === 'SYSTEM' ? 'SYSTEM' : user.nickname,
        profileUrl: messageType === 'SYSTEM' ? '' : user.profileUrl,
      },
      content,
      timestamp: new Date(Date.now() - (count - index) * 120000).toISOString(), // 2분 간격
    };
  });
};

// 페이지네이션을 위한 Mock 데이터 저장소
let mockMessagesStore: ChatMessage[] = [];

// Mock 데이터 초기화 (75개 메시지 생성)
const initializeMockData = () => {
  if (mockMessagesStore.length === 0) {
    mockMessagesStore = generateMockMessages(75);
    console.log(
      '🎭 Mock 데이터 초기화 완료:',
      mockMessagesStore.length,
      '개 메시지',
    );
  }
};
////////////////////////////////////////////////////////////
// API 응답 타입들 (camelCase 통일)
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

// 프론트엔드 사용 타입 (기존과 동일)
export interface ChatHistoryResponse {
  messages: ChatMessage[];
  hasMore: boolean;
  currentPage: number;
  totalCount: number;
}

// Adapter 함수 (간단해짐)
const adaptChatMessage = (backendMsg: BackendChatMessage): ChatMessage => {
  return {
    type: backendMsg.type as 'GROUP' | 'PRIVATE' | 'SYSTEM',
    sender: {
      userId: backendMsg.sender.userId,
      nickname: backendMsg.sender.nickname,
      profileUrl: backendMsg.sender.profileUrl,
    },
    content: backendMsg.content,
    timestamp: backendMsg.createdAt,
  };
};

const adaptChatResponse = (
  backendResponse: BackendChatResponse,
): ChatHistoryResponse => {
  return {
    messages: backendResponse.data.messages.map(adaptChatMessage),
    hasMore: backendResponse.data.pagination.hasNext,
    currentPage: backendResponse.data.pagination.currentPage,
    totalCount: backendResponse.data.pagination.totalMessages,
  };
};

export interface SendMessageRequest {
  type: 'GROUP' | 'PRIVATE' | 'SYSTEM';
  content: string;
  roomId: string;
  receiverId?: string; // 개인 메시지용
}

export interface SendMessageResponse {
  success: boolean;
  messageId: string;
  timestamp: string;
}

// 채팅 API 클래스
class ChatAPI {
  private baseUrl = `${import.meta.env.VITE_BACK_URL}`; // 백엔드 API 기본 URL

  // Mock 데이터 초기화 메서드 (외부에서 호출 가능)
  initializeMockData() {
    initializeMockData();
  }

  // 메시지 히스토리 조회 (새로운 명세)
  async getChatHistory(
    roomId: string,
    page: number = 1,
    limit: number = 50,
    type: string = 'TEXT',
  ): Promise<ChatHistoryResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        type,
      });

      const response = await fetch(
        `${this.baseUrl}/study-rooms/${roomId}/messages?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}` // 나중에 추가
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const backendResponse: BackendChatResponse = await response.json();
      return adaptChatResponse(backendResponse);
    } catch (error) {
      console.error('채팅 히스토리 조회 실패:', error);

      // Mock 데이터로 페이지네이션 시뮬레이션 (page 기반)
      if (mockMessagesStore.length === 0) {
        initializeMockData();
      }

      // 페이지 기반 계산
      const startIndex = (page - 1) * limit;
      const endIndex = Math.min(startIndex + limit, mockMessagesStore.length);
      const messages = mockMessagesStore.slice(startIndex, endIndex);
      const hasMore = endIndex < mockMessagesStore.length;

      console.log('📚 Mock 히스토리 응답 (페이지 기반):', {
        page,
        startIndex,
        endIndex,
        returnedCount: messages.length,
        hasMore,
        totalInStore: mockMessagesStore.length,
      });

      return {
        messages,
        hasMore,
        currentPage: page,
        totalCount: mockMessagesStore.length,
      };
      // 백엔드 없을 때 임시 응답
      // return {
      //   messages: [],
      //   hasMore: false,
      //   totalCount: 0
      // };
    }
  }

  // 개인 메시지 히스토리 조회 (특정 사용자와의 대화)
  async getPrivateHistory(
    roomId: string,
    userId: string,
    cursor?: string,
    limit: number = 50,
  ): Promise<ChatHistoryResponse> {
    try {
      const params = new URLSearchParams({
        userId,
        limit: limit.toString(),
        ...(cursor && { cursor }),
      });

      const response = await fetch(
        `${this.baseUrl}/rooms/${roomId}/private-history?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('개인 채팅 히스토리 조회 실패 - Mock 데이터 사용:', error);

      // 👈 다양한 사용자 간의 대화로 수정
      const currentUserId = 3; // 현재 사용자 ID
      const targetUserId = parseInt(userId);

      const mockUsers = [
        { userId: 1, nickname: 'Alice' },
        { userId: 2, nickname: 'Bob' },
        { userId: 3, nickname: 'Charlie' },
        { userId: 4, nickname: 'Diana' },
        { userId: 5, nickname: 'Eve' },
      ];

      const currentUser =
        mockUsers.find((u) => u.userId === currentUserId) || mockUsers[2];
      const targetUser =
        mockUsers.find((u) => u.userId === targetUserId) || mockUsers[0];

      // 개인 메시지 Mock 데이터 (양방향 대화)
      const privateMessages: ChatMessage[] = Array.from(
        { length: 15 },
        (_, index) => {
          const isFromCurrentUser = index % 3 !== 0; // 3분의 2는 내가 보낸 메시지
          const sender = isFromCurrentUser ? currentUser : targetUser;
          const receiver = isFromCurrentUser
            ? targetUserId.toString()
            : currentUserId.toString();

          const sampleMessages = [
            '안녕하세요!',
            '오늘 회의 어떠셨나요?',
            '자료 확인 부탁드려요.',
            '네, 알겠습니다.',
            '수고하셨습니다!',
            '질문이 있어서 연락드려요.',
            '확인했습니다.',
            '내일 뵙겠습니다.',
            '좋은 아이디어네요!',
            '진행상황 어떤가요?',
          ];

          return {
            type: 'PRIVATE',
            sender: {
              userId: sender.userId,
              nickname: sender.nickname,
              profileUrl: '/api/placeholder/32/32',
            },
            receiver,
            content: sampleMessages[index % sampleMessages.length],
            timestamp: new Date(
              Date.now() - (15 - index) * 300000,
            ).toISOString(), // 5분 간격
          };
        },
      );

      return {
        messages: privateMessages.slice(0, limit),
        hasMore: privateMessages.length > limit,
        nextCursor: undefined,
        totalCount: privateMessages.length,
      };
    }
  }

  // 메시지 전송 (백업용 - STOMP 실패시 사용)
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      throw error;
    }
  }
  // Mock 데이터 초기화 (테스트용)
  resetMockData() {
    mockMessagesStore = [];
    console.log('🔄 Mock 데이터 초기화됨');
  }

  // Mock 데이터에 새 메시지 추가 (실시간 메시지 시뮬레이션)
  addMockMessage(message: ChatMessage) {
    mockMessagesStore.push(message); // 맨 앞에 추가 (최신 메시지)
    console.log('➕ Mock 메시지 추가됨. 총', mockMessagesStore.length, '개');
  }
}

// 싱글톤 인스턴스 생성
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
  cursor?: string,
  limit?: number,
) => chatApi.getPrivateHistory(roomId, userId, cursor, limit);

export const sendMessage = (request: SendMessageRequest) =>
  chatApi.sendMessage(request);

// 테스트용 함수들
export const resetMockChatData = () => chatApi.resetMockData();
export const addMockChatMessage = (message: ChatMessage) =>
  chatApi.addMockMessage(message);
