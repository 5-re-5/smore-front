import { useEffect } from 'react';
import { useRoomContext } from '@livekit/components-react';
import {
  RoomEvent,
  type RemoteParticipant,
  type LocalParticipant,
  DataPacket_Kind,
} from 'livekit-client';
import { useRoomStateStore } from '@/features/room';

export function useOwnerExitListener(roomId: number) {
  const room = useRoomContext();
  const { setIntentionalExit } = useRoomStateStore();

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
          setIntentionalExit(roomId, true);
          room.disconnect(true);
          alert('방장 나감');
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
