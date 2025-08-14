import { useEffect } from 'react';
import { useRoomContext } from '@livekit/components-react';
import {
  RoomEvent,
  type RemoteParticipant,
  type LocalParticipant,
  DataPacket_Kind,
} from 'livekit-client';
import { useRoomStateStore } from '@/features/room';
import { useQueryClient } from '@tanstack/react-query';
import { cleanupLocalTracks } from '@/shared/utils/trackCleanup';
import { toast } from 'sonner';

export function useOwnerExitListener(roomId: number) {
  const room = useRoomContext();
  const { setIntentionalExit } = useRoomStateStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    // handler 시그니처는 LiveKit 타입에 맞추기 (payload, participant, kind, topic)
    const onData = (
      payload: Uint8Array,
      _participant?: RemoteParticipant | LocalParticipant,
      _kind?: DataPacket_Kind,
      _topic?: string,
    ) => {
      try {
        const msg = JSON.parse(new TextDecoder().decode(payload));
        if (msg?.type === 'OWNER_EXIT' && msg.roomId === roomId) {
          // 강제 나가기 전에 local tracks 정리 (카메라/마이크 끄기)
          cleanupLocalTracks(room).then(() => {
            queryClient.invalidateQueries({ queryKey: ['study-rooms'] });
            queryClient.invalidateQueries({ queryKey: ['recentStudy'] });
            queryClient.invalidateQueries({ queryKey: ['room'] });
            setIntentionalExit(roomId, true);
            room.disconnect(true);
            toast.error('방장이 퇴장했습니다.');
          });
        }
      } catch {
        // ignore
      }
    };

    // ✅ 리스너 등록
    room.on(RoomEvent.DataReceived, onData);

    // ✅ cleanup에서 off 호출해야 함 (여기서 아무것도 리턴하지 않으면 안됨)
    return () => {
      room.off(RoomEvent.DataReceived, onData);
    };
  }, [room, roomId, setIntentionalExit]);
}
