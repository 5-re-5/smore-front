import { request, REQUEST_METHOD } from '@/shared/api/request';
import type { RoomData } from './type';

export const getRoomInfo = async (roomId: number) => {
  return request<RoomData>({
    method: REQUEST_METHOD.GET,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms/${roomId}`,
  });
};
