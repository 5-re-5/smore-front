import { request, REQUEST_METHOD } from '@/shared/api/request';

// 고정값 상수
const TOKEN_EXPIRY_SECONDS = 3600;
const CAN_PUBLISH = true;
const CAN_SUBSCRIBE = true;

// 방 재입장 요청 타입
export type RejoinRoomRequest = {
  canPublish: boolean;
  canSubscribe: boolean;
  tokenExpirySeconds: number;
};

// 방 재입장 응답 타입
export type RejoinRoomResponse = {
  accessToken: string;
  roomName: string;
  identity: string;
  expiresAt: string;
  canPublish: boolean;
  canSubscribe: boolean;
  createdAt: string;
};

// 방 재입장 API 함수
export const rejoinRoom = async (
  roomId: number,
  userId: number,
  signal?: AbortSignal,
) => {
  const response = await request<RejoinRoomResponse, RejoinRoomRequest>({
    method: REQUEST_METHOD.POST,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms/${roomId}/rejoin?userId=${userId}`,
    data: {
      canPublish: CAN_PUBLISH,
      canSubscribe: CAN_SUBSCRIBE,
      tokenExpirySeconds: TOKEN_EXPIRY_SECONDS,
    },
    signal,
  });

  return response.data;
};
