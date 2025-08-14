import { useDataChannel } from '@livekit/components-react';
import { usePomodoroStore } from './usePomodoroStore';
import { usePomodoroStateBroadcaster } from './usePomodoroStateBroadcaster';
import type { PomodoroSyncData } from './types';

export const usePomodoroSync = () => {
  const {
    phase,
    remainingTime,
    isRunning,
    totalCycles,
    isOwner,
    updateFromSync,
  } = usePomodoroStore();

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
    isOwner ? undefined : handlePomodoroMessage,
  );

  const broadcaster = usePomodoroStateBroadcaster({
    isOwner,
    phase,
    remainingTime,
    isRunning,
    totalCycles,
    send,
  });

  return {
    isConnected: broadcaster.isConnected || !!message,
  };
};
