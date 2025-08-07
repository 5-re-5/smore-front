import { useQuery, useMutation } from '@tanstack/react-query';
import { getRoomInfo, getRooms, verifyRoomPassword } from './room';
import type { RoomListParams } from './type';
import { roomQueryKeys } from './queryKeys';

// Room 상세 조회
export const useRoomInfoQuery = (roomId: number) => {
  return useQuery({
    queryKey: [roomQueryKeys.ROOM, roomId],
    queryFn: () => getRoomInfo(roomId),
    enabled: !!roomId,
  });
};

// Room 목록 조회
export const useRoomListQuery = (params?: RoomListParams) => {
  return useQuery({
    queryKey: [roomQueryKeys.ROOM_LIST, params],
    queryFn: () => getRooms(params),
  });
};

// Room 비밀번호 검증
export const useVerifyRoomPasswordMutation = () => {
  return useMutation({
    mutationFn: ({ roomId, password }: { roomId: number; password: string }) =>
      verifyRoomPassword(roomId, password),
  });
};
