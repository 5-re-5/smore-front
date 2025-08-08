import { request, REQUEST_METHOD } from '@/shared/api/request';

export const leaveRoom = async (roomId: number, userId: number) => {
  const response = await request({
    method: REQUEST_METHOD.POST,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms/${roomId}/leave?userId=${userId}`,
  });

  return response.data;
};
