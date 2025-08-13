import { useQuery, useMutation } from '@tanstack/react-query';
import { getRoomInfo } from './room';
import { joinRoom } from './joinRoom';
import { rejoinRoom } from './rejoinRoom';
import { leaveRoom } from './leaveRoom';
import { deleteRoom } from './deleteRoom';
import { useRoomTokenStore } from '../model/useRoomTokenStore';
import { roomQueryKeys } from './queryKeys';
import { useRoomStateStore } from '@/features/room';
import { useRoomContext } from '@livekit/components-react';

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

// export const useDeleteRoomMutation = () => {
//   const { clearToken } = useRoomTokenStore();
//   const { setIntentionalExit } = useRoomStateStore();
//   const room = useRoomContext();

//   return useMutation({
//     mutationFn: ({ roomId, userId }: { roomId: number; userId: number }) =>
//       deleteRoom(roomId, userId),
//     onSuccess: (_, variables) => {
//       room.disconnect(true);
//       clearToken(variables.roomId);
//       setIntentionalExit(variables.roomId, true);
//     },
//   });
// };

// 저장된 입장 토큰 조회
export const useRoomToken = (roomId: number) => {
  const { getToken } = useRoomTokenStore();
  return getToken(roomId);
};

type Vars = { roomId: number; userId: number };

export const useDeleteRoomMutation = () => {
  const { clearToken } = useRoomTokenStore();
  const { setIntentionalExit } = useRoomStateStore();
  const room = useRoomContext(); // LiveKitRoom 내부에서만 사용 가능

  return useMutation({
    // ✔ 서버를 쓰는 경우: 방 삭제 API 호출 (없다면 더미로 대체 가능)
    mutationFn: ({ roomId, userId }: Vars) => deleteRoom(roomId, userId),

    // ✔ 네트워크 요청 전에 "전원 퇴장" 신호 브로드캐스트 (옵티미스틱)
    onMutate: async ({ roomId }) => {
      try {
        const msg = { type: 'OWNER_EXIT', roomId, ts: Date.now() };
        const bytes = new TextEncoder().encode(JSON.stringify(msg));
        // reliable 전송으로 최대한 전달 보장
        await room.localParticipant?.publishData(bytes, { reliable: true });
      } catch {
        // 신호 실패해도 서버 deleteRoom이 있으면 강제 종료될 것임
        // 서버가 없다면 아래 onSettled의 로컬 disconnect로 최소한 본인은 종료
      }
    },

    // ✔ 서버 성공 시: 토큰/의도적 나가기 정리
    onSuccess: (_data, vars) => {
      clearToken(vars.roomId);
      setIntentionalExit(vars.roomId, true);
      // 서버 deleteRoom 성공이면 다른 클라들도 곧 onDisconnected 됨
    },

    // ✔ 성공/실패와 무관하게: 로컬 연결은 반드시 끊어 UX 보장
    onSettled: (_res, _err, vars) => {
      // 재입장 루프 방지 플래그는 실패 케이스에도 반드시 세팅
      setIntentionalExit(vars.roomId, true);

      // 브로드캐스트가 퍼질 약간의 시간(300ms) 후 본인도 종료
      // (서버 deleteRoom이 있으면 이미 끊길 수도 있음)
      setTimeout(() => {
        try {
          room.disconnect(true); // stopTracks=true
        } catch (error) {
          console.error(error);
        }
      }, 300);
    },
  });
};
