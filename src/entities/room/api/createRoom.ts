import { request, REQUEST_METHOD } from '@/shared/api/request';
import type { AxiosRequestConfig } from 'axios';

export interface CreateRoomFormData {
  title: string;
  description?: string;
  password?: string;
  maxParticipants: number;
  tag?: string;
  category: string;
  focusTime?: number;
  breakTime?: number;
  roomImage?: File;
}

export interface CreateRoomResponse {
  roomId: number;
  title: string;
  description?: string;
  maxParticipants: number;
  category: string;
  createdAt: string;
}

export const createRoom = async (
  formData: CreateRoomFormData,
  userId: number,
) => {
  const form = new FormData();

  form.append('title', formData.title);
  if (formData.description) {
    form.append('description', formData.description);
  }
  if (formData.password) {
    form.append('password', formData.password);
  }
  form.append('maxParticipants', formData.maxParticipants.toString());
  if (formData.tag) {
    form.append('tag', formData.tag);
  }
  form.append('category', formData.category);
  if (formData.focusTime) {
    form.append('focusTime', formData.focusTime.toString());
  }
  if (formData.breakTime) {
    form.append('breakTime', formData.breakTime.toString());
  }
  if (formData.roomImage) {
    form.append('roomImage', formData.roomImage);
  }

  const config: AxiosRequestConfig = {
    method: REQUEST_METHOD.POST,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms?userId=${userId}`,
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await request<CreateRoomResponse>(config);

  return response.data;
};
