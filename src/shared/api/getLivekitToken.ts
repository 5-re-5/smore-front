import { API_SERVER_URL } from '@/shared/config/livekit';
import { request, REQUEST_METHOD } from './request';

// API 응답 타입
type LivekitTokenResponse = {
  token: string;
};

// API 호출 함수
export const getLivekitToken = (roomName: string, participantName: string) => {
  return request<LivekitTokenResponse>({
    method: REQUEST_METHOD.POST,
    url: `${API_SERVER_URL}/token`,
    data: {
      roomName,
      participantName,
    },
  });
};
