import { request, REQUEST_METHOD } from '@/shared/api/request';
import type { AxiosRequestConfig } from 'axios';

interface FocusRecord {
  recordId: number;
  userId: number;
  timestamp: string;
  status: number;
}

interface FocusRecordResponse {
  record: FocusRecord;
}

interface SubmitFocusImageParams {
  userId: number;
  image: Blob;
}

/**
 * AI 서버로 집중도 분석을 위한 이미지를 전송합니다.
 * @param params userId와 image blob을 포함한 파라미터
 * @returns AI 서버 응답 데이터
 */
export const submitFocusImage = async ({
  userId,
  image,
}: SubmitFocusImageParams) => {
  const formData = new FormData();

  // FormData에 데이터 추가
  formData.append('userId', userId.toString());
  formData.append('image', image, 'capture.jpg');

  const config: AxiosRequestConfig = {
    method: REQUEST_METHOD.POST,
    url: `${import.meta.env.VITE_BACK_URL}/ai/focus-records`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await request<FocusRecordResponse>(config);
  return response.data;
};
