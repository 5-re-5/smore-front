import { useEffect, useRef, useState } from 'react';
import { useRoomContext } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import type { PomodoroSyncData } from './types';

interface UsePomodoroStateBroadcasterProps {
  isOwner: boolean;
  phase: 'study' | 'break';
  remainingTime: number;
  isRunning: boolean;
  totalCycles: number;
  send?:
    | ((payload: Uint8Array, options: Record<string, unknown>) => Promise<void>)
    | undefined;
}

export const usePomodoroStateBroadcaster = ({
  isOwner,
  phase,
  remainingTime,
  isRunning,
  totalCycles,
  send,
}: UsePomodoroStateBroadcasterProps) => {
  const room = useRoomContext();
  const [isConnected, setIsConnected] = useState(false);
  const prevStateRef = useRef<{
    phase: string;
    remainingTime: number;
    isRunning: boolean;
    totalCycles: number;
  } | null>(null);

  useEffect(() => {
    const connected = room?.state === ConnectionState.Connected && !!send;
    setIsConnected(connected);
  }, [room?.state, send]);

  useEffect(() => {
    if (
      !isOwner ||
      !send ||
      !room ||
      room.state !== ConnectionState.Connected
    ) {
      return;
    }

    const currentState = { phase, remainingTime, isRunning, totalCycles };
    const hasStateChanged =
      !prevStateRef.current ||
      JSON.stringify(prevStateRef.current) !== JSON.stringify(currentState);

    if (!hasStateChanged) {
      return;
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
  }, [isOwner, phase, remainingTime, isRunning, totalCycles, send, room]);

  return {
    isConnected,
  };
};
