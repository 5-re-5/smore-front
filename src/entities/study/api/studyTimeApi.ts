import { request, REQUEST_METHOD } from '@/shared/api/request';

export interface StudyTimeResponse {
  id: number;
  userId: number;
  startTime: string;
  totalStudyTime: number;
  lastUpdateTime: string;
}

export interface UpdateStudyTimeData {
  studyTime: number;
}

export const startStudyTime = async (userId: number, signal?: AbortSignal) => {
  const response = await request<StudyTimeResponse>({
    method: REQUEST_METHOD.POST,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/study-times/${userId}`,
    signal,
  });

  return response.data;
};

export const updateStudyTime = async (userId: number, signal?: AbortSignal) => {
  const response = await request<StudyTimeResponse>({
    method: REQUEST_METHOD.PATCH,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/study-times/${userId}`,
    signal,
  });

  return response.data;
};
