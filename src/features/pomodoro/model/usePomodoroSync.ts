import { useEffect } from 'react';
import { useDataChannel, useRoomContext } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import { usePomodoroStore } from './usePomodoroStore';

interface PomodoroSyncData {
  type: 'pomodoro-update';
  phase: 'study' | 'break';
  remainingTime: number;
  isRunning: boolean;
  totalCycles: number;
  timestamp: number;
}

export const usePomodoroSync = () => {
  const {
    phase,
    remainingTime,
    isRunning,
    totalCycles,
    isHost,
    updateFromSync,
  } = usePomodoroStore();

  const room = useRoomContext();

  // Participants: receive data with callback
  const handlePomodoroMessage = (message: { payload: Uint8Array }) => {
    try {
      if (!message || !message.payload) {
        console.warn('Invalid message received: missing payload');
        return;
      }

      const decoder = new TextDecoder();
      const dataString = decoder.decode(message.payload);
      const data = JSON.parse(dataString) as PomodoroSyncData;

      if (
        !data ||
        data.type !== 'pomodoro-update' ||
        typeof data.phase !== 'string' ||
        typeof data.remainingTime !== 'number' ||
        typeof data.isRunning !== 'boolean' ||
        typeof data.totalCycles !== 'number' ||
        typeof data.timestamp !== 'number'
      ) {
        console.warn('Invalid pomodoro sync data structure:', data);
        return;
      }

      const networkLatency = Date.now() - data.timestamp;
      const compensatedTime = Math.max(
        0,
        data.remainingTime - Math.floor(networkLatency / 1000),
      );

      updateFromSync(
        data.phase,
        compensatedTime,
        data.isRunning,
        data.totalCycles,
      );
    } catch (error) {
      console.error('Failed to parse pomodoro sync data:', error);
    }
  };

  // Host: send data channel
  const { send } = useDataChannel('pomodoro');
  // Participants: receive with message handler
  const { message } = useDataChannel(
    'pomodoro',
    isHost ? undefined : handlePomodoroMessage,
  );

  // Host broadcasts state changes
  useEffect(() => {
    if (!isHost) return;

    if (!send) {
      console.warn('Data channel send function not available');
      return;
    }

    // Check room connection state
    if (!room || room.state !== ConnectionState.Connected) {
      console.warn('Room not connected, skipping pomodoro sync broadcast');
      return;
    }

    const broadcastData: PomodoroSyncData = {
      type: 'pomodoro-update',
      phase,
      remainingTime,
      isRunning,
      totalCycles,
      timestamp: Date.now(),
    };

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(broadcastData));

      send(data, { reliable: true });
    } catch (error) {
      console.error('Failed to send pomodoro sync data:', error);
    }
  }, [phase, remainingTime, isRunning, totalCycles, isHost, send, room]);

  return {
    isConnected:
      room?.state === ConnectionState.Connected && (!!send || !!message),
  };
};
