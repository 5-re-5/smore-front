import { request, REQUEST_METHOD } from '@/shared/api/request';

export const deleteRoom = async (
  roomId: number,
  userId: number,
  signal?: AbortSignal,
) => {
  const response = await request({
    method: REQUEST_METHOD.DELETE,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms/${roomId}?ownerId=${userId}`,
    signal,
  });

  return response.data;
};
