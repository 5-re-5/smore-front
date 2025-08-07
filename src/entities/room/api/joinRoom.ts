import { request, REQUEST_METHOD } from '@/shared/api/request';

// 고정값 상수
const TOKEN_EXPIRY_SECONDS = 7200;
const CAN_PUBLISH = true;
const CAN_SUBSCRIBE = true;

// 방 입장 요청 타입
export type JoinRoomRequest = {
  identity: string;
  password: string | null;
  tokenExpirySeconds: number;
  canPublish: boolean;
  canSubscribe: boolean;
};

// 방 입장 응답 타입
export type JoinRoomResponse = {
  accessToken: string;
  roomName: string;
  identity: string;
  expiresAt: string;
  canPublish: boolean;
  canSubscribe: boolean;
  createdAt: string;
};

// 방 입장 API 함수
export const joinRoom = async (
  roomId: number,
  userId: number,
  identity: string,
  password?: string,
) => {
  const response = await request<JoinRoomResponse, JoinRoomRequest>({
    method: REQUEST_METHOD.POST,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms/${roomId}/join?userId=${userId}`,
    data: {
      identity,
      password: password || null,
      tokenExpirySeconds: TOKEN_EXPIRY_SECONDS,
      canPublish: CAN_PUBLISH,
      canSubscribe: CAN_SUBSCRIBE,
    },
  });

  return response.data;
};
