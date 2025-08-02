import { useQuery } from '@tanstack/react-query';
import { roomApi } from '@/shared/api/room';
import { adaptRoomFromApi } from './adapters';
import { type Room } from './types';

// 도메인 모델을 반환하는 훅 - 컴포넌트에서는 이것만 사용
export const useRoomInfo = (roomId: number) => {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: async (): Promise<Room> => {
      const apiResponse = await roomApi.getRoom(roomId);
      return adaptRoomFromApi(apiResponse); // 🔑 여기서 변환!
    },
    enabled: !!roomId,
  });
};

// 비밀번호 검증 훅
export const useVerifyPassword = () => {
  return useQuery({
    queryKey: ['room-password'],
    queryFn: async ({ queryKey }) => {
      const [, roomId, password] = queryKey as [string, number, string];
      return roomApi.verifyPassword(roomId, password);
    },
    enabled: false, // 수동으로 트리거
  });
};
