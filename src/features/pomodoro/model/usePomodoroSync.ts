import { useEffect } from 'react';
import { useDataChannel } from '@livekit/components-react';
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

  // Participants: receive data with callback
  const handlePomodoroMessage = (message: { payload: Uint8Array }) => {
    try {
      const decoder = new TextDecoder();
      const dataString = decoder.decode(message.payload);
      const data = JSON.parse(dataString) as PomodoroSyncData;

      if (data.type === 'pomodoro-update') {
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
      }
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

    const broadcastData: PomodoroSyncData = {
      type: 'pomodoro-update',
      phase,
      remainingTime,
      isRunning,
      totalCycles,
      timestamp: Date.now(),
    };

    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(broadcastData));

    send(data, { reliable: true });
  }, [phase, remainingTime, isRunning, totalCycles, isHost, send]);

  return {
    isConnected: !!message || isHost,
  };
};
