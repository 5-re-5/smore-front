// Room API 타입 정의
export interface RoomData {
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
}

export interface RoomListParams {
  category?: string;
  page?: number;
  limit?: number;
}

export interface VerifyPasswordRequest {
  password: string;
}

export interface VerifyPasswordResponse {
  valid: boolean;
  message?: string;
}
