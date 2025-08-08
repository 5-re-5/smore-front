import { request, REQUEST_METHOD } from '@/shared/api/request';
import type { RoomData, RoomListParams } from './type';

export const getRoomInfo = async (roomId: number) => {
  return request<RoomData>({
    method: REQUEST_METHOD.GET,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms/${roomId}`,
  });
};

export const getRooms = (params?: RoomListParams) => {
  return request<RoomData[]>({
    method: REQUEST_METHOD.GET,
    url: '/rooms',
    params,
  });
};

export const verifyRoomPassword = async (roomId: number, password: string) => {
  // TODO: 임시로 mock 데이터 사용 - 나중에 실제 API로 교체
  const { mockRooms } = await import('./mockData');
  const mockRoom = mockRooms[roomId];
  if (!mockRoom) {
    throw new Error(`Room ${roomId} not found`);
  }

  await new Promise((resolve) => setTimeout(resolve, 300));
  const isValid = mockRoom.data.password === password;
  return { valid: isValid };

  // 실제 API 호출 (나중에 활성화)
  // return request<VerifyPasswordResponse>({
  //   method: REQUEST_METHOD.POST,
  //   url: `/rooms/${roomId}/verify-password`,
  //   data: { password },
  // });
};
