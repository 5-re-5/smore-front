// Room API 타입 정의
export interface RoomData {
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
