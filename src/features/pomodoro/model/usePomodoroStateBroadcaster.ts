import { useRef } from 'react';
import { useRoomContext } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';

interface PomodoroSyncData {
  type: 'pomodoro-update';
  phase: 'study' | 'break';
  remainingTime: number;
  isRunning: boolean;
  totalCycles: number;
  timestamp: number;
}

interface UsePomodoroStateBroadcasterProps {
  isHost: boolean;
  phase: 'study' | 'break';
  remainingTime: number;
  isRunning: boolean;
  totalCycles: number;
  send?:
    | ((payload: Uint8Array, options: Record<string, unknown>) => Promise<void>)
    | undefined;
}

export const usePomodoroStateBroadcaster = ({
  isHost,
  phase,
  remainingTime,
  isRunning,
  totalCycles,
  send,
}: UsePomodoroStateBroadcasterProps) => {
  const room = useRoomContext();
  const prevStateRef = useRef<{
    phase: string;
    remainingTime: number;
    isRunning: boolean;
    totalCycles: number;
  } | null>(null);

  if (!isHost || !send || !room || room.state !== ConnectionState.Connected) {
    return {
      isConnected: room?.state === ConnectionState.Connected && !!send,
    };
  }

  const currentState = { phase, remainingTime, isRunning, totalCycles };
  const hasStateChanged =
    !prevStateRef.current ||
    JSON.stringify(prevStateRef.current) !== JSON.stringify(currentState);

  if (!hasStateChanged) {
    return {
      isConnected: room?.state === ConnectionState.Connected && !!send,
    };
  }

  prevStateRef.current = currentState;

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
    send(data, { reliable: true }).catch((error: unknown) => {
      console.error('Failed to send pomodoro sync data:', error);
    });
  } catch (error) {
    console.error('Failed to encode pomodoro sync data:', error);
  }

  return {
    isConnected: room?.state === ConnectionState.Connected && !!send,
  };
};
