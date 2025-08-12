import { useCallback, useState } from 'react';
import { updateRoomParticipantMedia } from '@/entities/user/api/userApi';
import { useDebounce } from './useDebounce';

interface UseMediaSyncOptions {
  roomId: number;
  userId: number;
  onError?: (error: Error) => void;
  debounceDelay?: number;
}

interface MediaState {
  audioEnabled: boolean;
  videoEnabled: boolean;
}

export const useMediaSync = ({
  roomId,
  userId,
  onError,
  debounceDelay = 500,
}: UseMediaSyncOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const syncToServer = useCallback(
    async (mediaState: MediaState) => {
      if (!roomId || !userId) return;

      try {
        setIsLoading(true);
        setError(null);
        await updateRoomParticipantMedia(roomId, userId, mediaState);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('미디어 설정 업데이트 실패');
        setError(error);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [roomId, userId, onError],
  );

  const { debouncedCallback: debouncedSyncToServer } = useDebounce(
    syncToServer,
    debounceDelay,
  );

  const updateMediaSettings = useCallback(
    (mediaState: MediaState) => {
      // 즉시 서버 동기화 (디바운스)
      debouncedSyncToServer(mediaState);
    },
    [debouncedSyncToServer],
  );

  const sendInitialMediaSettings = useCallback(
    (mediaState: MediaState) => {
      // 방 입장 시에는 즉시 전송 (디바운스 없이)
      syncToServer(mediaState);
    },
    [syncToServer],
  );

  return {
    updateMediaSettings,
    sendInitialMediaSettings,
    isLoading,
    error,
  };
};
