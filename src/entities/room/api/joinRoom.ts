import { request, REQUEST_METHOD } from '@/shared/api/request';

// 방 입장 요청 타입
export type JoinRoomRequest = {
  password: string;
};

// 방 입장 응답 타입
export type JoinRoomResponse = {
  room_id: number;
  joined_at: string;
};

// 방 입장 API 함수
export const joinRoom = async (
  roomId: number,
  { password }: JoinRoomRequest,
) => {
  const response = await request<JoinRoomResponse, JoinRoomRequest>({
    method: REQUEST_METHOD.POST,
    url: `/api/v1/study-rooms/${roomId}/join`,
    data: { password },
  });

  return response.data;
};
