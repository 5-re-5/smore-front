import axios from 'axios';
import { API_SERVER_URL } from '@/shared/config/livekit';

// LiveKit 토큰 API 호출 함수 (withCredentials 없이)
export const getLivekitToken = async (
  roomName: string,
  participantName: string,
): Promise<string> => {
  const response = await axios.post(
    `${API_SERVER_URL}/token`,
    {
      roomName,
      participantName,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      // withCredentials 없이 요청
    },
  );

  // 응답이 직접 토큰 문자열인 경우와 객체인 경우 모두 처리
  return typeof response.data === 'string'
    ? response.data
    : response.data.token;
};
