import axios from 'axios';
import { API_SERVER_URL } from '@/shared/config/livekit';

export const getLivekitToken = async (
  roomName: string,
  participantName: string,
): Promise<string> => {
  const { data } = await axios.post(`${API_SERVER_URL}/token`, {
    roomName,
    participantName,
  });

  return data.token;
};
