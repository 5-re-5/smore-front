import { useQuery, useMutation } from '@tanstack/react-query';
import { getRoomInfo } from './room';
import { joinRoom } from './joinRoom';
import { rejoinRoom } from './rejoinRoom';
import { leaveRoom } from './leaveRoom';
import { deleteRoom } from './deleteRoom';
import { useRoomTokenStore } from '../model/useRoomTokenStore';
import { roomQueryKeys } from './queryKeys';
import { useRoomStateStore } from '@/features/room';

// Room 상세 조회
export const useRoomInfoQuery = (roomId: number) => {
  return useQuery({
    queryKey: [roomQueryKeys.ROOM, roomId],
    queryFn: () => getRoomInfo(roomId),
    enabled: !!roomId,
  });
};

// Room 입장 (토큰 발급 포함)
export const useJoinRoomMutation = () => {
  const { setToken } = useRoomTokenStore();

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
      if (!data.accessToken) {
        throw new Error('서버에서 유효한 토큰을 받지 못했습니다.');
      }

      // 토큰을 store에 저장
      setToken(variables.roomId, data.accessToken);
    },
    onError: (error) => {
      console.error('❌ joinRoom API 실패:', error);
    },
  });
};

// Room 재입장
export const useRejoinRoomMutation = () => {
  const { setToken } = useRoomTokenStore();

  return useMutation({
    mutationFn: ({ roomId, userId }: { roomId: number; userId: number }) =>
      rejoinRoom(roomId, userId),
    onSuccess: (data, variables) => {
      if (!data.accessToken) {
        throw new Error('서버에서 유효한 토큰을 받지 못했습니다.');
      }

      setToken(variables.roomId, data.accessToken);
    },
    onError: () => {
      console.error('❌ rejoinRoom API 실패:');
    },
  });
};

export const useLeaveRoomMutation = () => {
  const { clearToken } = useRoomTokenStore();
  const { setIntentionalExit } = useRoomStateStore();

  return useMutation({
    mutationFn: ({ roomId, userId }: { roomId: number; userId: number }) =>
      leaveRoom(roomId, userId),
    onSuccess: (_, variables) => {
      // 방 나가기 성공 시 토큰 삭제 및 의도적 나가기 플래그 설정
      clearToken(variables.roomId);
      setIntentionalExit(variables.roomId, true);
    },
  });
};

export const useDeleteRoomMutation = () => {
  const { clearToken } = useRoomTokenStore();
  const { setIntentionalExit } = useRoomStateStore();

  return useMutation({
    mutationFn: ({ roomId, userId }: { roomId: number; userId: number }) =>
      deleteRoom(roomId, userId),
    onSuccess: (_, variables) => {
      clearToken(variables.roomId);
      setIntentionalExit(variables.roomId, true);
    },
  });
};

// 저장된 입장 토큰 조회
export const useRoomToken = (roomId: number) => {
  const { getToken } = useRoomTokenStore();
  return getToken(roomId);
};
