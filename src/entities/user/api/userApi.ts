import { request, REQUEST_METHOD } from '@/shared/api/request';
import type { UserProfile } from '../types';

export const getUserProfile = async (userId: number) => {
  const response = await request<UserProfile>({
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
