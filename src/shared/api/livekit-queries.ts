import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { getLivekitToken } from './getLivekitToken';

// Query Keys
export const livekitQueryKeys = {
  TOKEN: 'livekitToken',
} as const;

// LiveKit 토큰 조회 훅
export const useLivekitTokenQuery = (
  roomName: string,
  participantName: string,
  options?: Omit<UseQueryOptions<string>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<string>({
    queryKey: [livekitQueryKeys.TOKEN, roomName, participantName],
    queryFn: async () => {
      const response = await getLivekitToken(roomName, participantName);
      return response.data.token;
    },
    enabled: !!(roomName && participantName),
    ...options,
  });
};
