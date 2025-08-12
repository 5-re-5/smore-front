import { request, REQUEST_METHOD } from '@/shared/api/request';

export interface CreateRoomFormData {
  title: string;
  description?: string;
  password?: string;
  maxParticipants: number;
  tag?: string;
  category: string;
  focusTime?: number;
  breakTime?: number;
  room_image?: File;
}

export interface CreateRoomResponse {
  roomId: number;
  title: string;
  description?: string;
  maxParticipants: number;
  category: string;
  createdAt: string;
}

export const createRoom = async (formData: CreateRoomFormData) => {
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
  if (formData.room_image) {
    form.append('room_image', formData.room_image);
  }

  return request<CreateRoomResponse>({
    method: REQUEST_METHOD.POST,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/study-rooms`,
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
