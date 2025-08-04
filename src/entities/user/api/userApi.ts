import { request, REQUEST_METHOD } from '@/shared/api/request';
import type { GetUserRequest, GetUserResponse } from './types';

export const getUser = async ({ userId }: GetUserRequest) => {
  const response = await request<GetUserResponse>({
    method: REQUEST_METHOD.GET,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/users/${userId}`,
  });

  return response.data;
};

export const logout = async () => {
  await request({
    method: REQUEST_METHOD.POST,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/auth/logout`,
  });
};
