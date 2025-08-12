import { request, REQUEST_METHOD } from '@/shared/api/request';

export const deleteRoom = async (roomId: number, userId: number) => {
  const response = await request({
    method: REQUEST_METHOD.DELETE,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms/${roomId}?ownerId=${userId}`,
  });

  return response.data;
};
