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
    room_id: number;
    title: string;
    description?: string;
    thumbnail_url?: string;
    tag?: string;
    category: string;
    focus_time?: number | null;
    break_time?: number | null;
    max_participants: number;
    current_participants: number;
    password?: string | null;
    created_at: string;
    creator: {
      user_id: number;
      nickname: string;
    };
  };
}
