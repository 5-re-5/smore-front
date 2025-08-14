// 도메인 모델 - 우리 비즈니스 로직에서 사용하는 타입
export interface Room {
  id: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  tags: string[];
  category: string;
  focusTime?: number; // minutes
  breakTime?: number; // minutes
  maxParticipants: number;
  currentParticipants: number;
  hasPassword: boolean;
  createdAt: Date;
  creatorId: number;
  creatorName: string;
}

// API 응답 타입 - 백엔드 스키마 그대로
export interface RoomApiResponse {
  data: {
    roomId: number;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    tag?: string;
    category: string;
    focusTime?: number | null;
    breakTime?: number | null;
    maxParticipants: number;
    currentParticipants: number;
    password?: string | null;
    createdAt: string;
    creator: {
      userId: number;
      nickname: string;
    };
  };
}
