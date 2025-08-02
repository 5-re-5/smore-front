import { useEffect } from 'react';
import { useRoomContext } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';
import { usePomodoroStore } from './usePomodoroStore';

interface PomodoroSyncData {
  type: 'pomodoro-update';
  phase: 'study' | 'break';
  remainingTime: number;
  isRunning: boolean;
  timestamp: number;
}

export const usePomodoroSync = () => {
  const room = useRoomContext();
  const { phase, remainingTime, isRunning, isHost, updateFromSync } =
    usePomodoroStore();

  // Host
  useEffect(() => {
    if (!isHost || !room.localParticipant) return;

    const broadcastData: PomodoroSyncData = {
      type: 'pomodoro-update',
      phase,
      remainingTime,
      isRunning,
      timestamp: Date.now(),
    };

    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(broadcastData));

    room.localParticipant.publishData(data, { reliable: true });
  }, [phase, remainingTime, isRunning, isHost, room.localParticipant]);

  // Participants
  useEffect(() => {
    if (isHost || !room) return;

    const handleDataReceived = (payload: Uint8Array) => {
      try {
        const decoder = new TextDecoder();
        const dataString = decoder.decode(payload);
        const data = JSON.parse(dataString) as PomodoroSyncData;

        if (data.type === 'pomodoro-update') {
          // Apply network latency compensation
          const networkLatency = Date.now() - data.timestamp;
          const compensatedTime = Math.max(
            0,
            data.remainingTime - Math.floor(networkLatency / 1000),
          );

          updateFromSync(data.phase, compensatedTime, data.isRunning);
        }
      } catch (error) {
        console.error('Failed to parse pomodoro sync data:', error);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);

    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [isHost, room, updateFromSync]);

  return {
    isConnected: room?.state === 'connected',
  };
};
