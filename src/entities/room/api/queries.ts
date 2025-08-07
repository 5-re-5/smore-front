import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoomInfo, getRooms, verifyRoomPassword } from './room';
import { joinRoom } from './joinRoom';
import type { RoomListParams } from './type';
import type { JoinRoomResponse } from './joinRoom';
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

// Room 입장 (토큰 발급 포함)
export const useJoinRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      userId,
      identity,
      password,
    }: {
      roomId: number;
      userId: number;
      identity: string;
      password?: string;
    }) => joinRoom(roomId, userId, identity, password),
    onSuccess: (data, variables) => {
      // 토큰을 query cache에 저장
      queryClient.setQueryData(
        [roomQueryKeys.JOIN_TOKEN, variables.roomId],
        data,
      );
    },
  });
};

// 저장된 입장 토큰 조회
export const useJoinTokenQuery = (roomId: number) => {
  return useQuery<JoinRoomResponse | undefined>({
    queryKey: [roomQueryKeys.JOIN_TOKEN, roomId],
    queryFn: () => {
      // cache에서만 데이터를 가져오고, 없으면 undefined 반환
      return undefined;
    },
    enabled: false, // 자동 fetch 방지
    staleTime: Infinity, // 캐시된 데이터를 항상 fresh로 취급
  });
};
