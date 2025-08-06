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

export interface UpdateUserProfileData {
  nickname?: string;
  profileImage?: File;
  removeImage?: boolean;
  targetDateTitle?: string;
  targetDate?: string;
  goalStudyTime?: number;
  determination?: string;
}

export const updateUserProfile = async (
  userId: number,
  data: UpdateUserProfileData,
) => {
  const formData = new FormData();

  // 카멜케이스로 FormData 추가
  if (data.nickname !== undefined) {
    formData.append('nickname', data.nickname);
  }
  if (data.profileImage) {
    formData.append('profileImage', data.profileImage);
  }
  if (data.removeImage !== undefined) {
    formData.append('removeImage', data.removeImage.toString());
  }
  if (data.targetDateTitle !== undefined) {
    formData.append('targetDateTitle', data.targetDateTitle);
  }
  if (data.targetDate !== undefined) {
    formData.append('targetDate', data.targetDate);
  }
  if (data.goalStudyTime !== undefined) {
    formData.append('goalStudyTime', data.goalStudyTime.toString());
  }
  if (data.determination !== undefined) {
    formData.append('determination', data.determination);
  }

  const response = await request<UserProfile>({
    method: REQUEST_METHOD.PATCH,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/users/${userId}`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export interface UpdateUserSettingsData {
  targetDateTitle?: string;
  targetDate?: string;
  goalStudyTime?: number;
  determination?: string;
}

export const updateUserSettings = async (
  userId: number,
  data: UpdateUserSettingsData,
) => {
  const formData = new FormData();

  // 설정 관련 필드만 FormData에 추가 (카멜케이스)
  if (data.targetDateTitle !== undefined) {
    formData.append('targetDateTitle', data.targetDateTitle);
  }
  if (data.targetDate !== undefined) {
    formData.append('targetDate', data.targetDate);
  }
  if (data.goalStudyTime !== undefined) {
    formData.append('goalStudyTime', data.goalStudyTime.toString());
  }
  if (data.determination !== undefined) {
    formData.append('determination', data.determination);
  }

  const response = await request<UserProfile>({
    method: REQUEST_METHOD.PATCH,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/users/${userId}`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
