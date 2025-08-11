import { useCallback, useEffect, useRef } from 'react';
import { useMediaControlStore, type MediaType } from './useMediaControlStore';

export type MediaDeviceKind = 'videoinput' | 'audioinput' | 'audiooutput';

interface MediaToggleOptions {
  deviceId?: string;
  onError?: (error: Error) => void;
  onDeviceChange?: (deviceType: MediaDeviceKind, deviceId: string) => void;
  onPermissionDenied?: () => void; // 권한 거부 시 콜백
  audioElement?: HTMLAudioElement | HTMLVideoElement; // 스피커용
}

const CAMERA_CONSTRAINTS = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  frameRate: { ideal: 30 },
};

const MICROPHONE_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

/**
 * 미디어 디바이스를 완전히 중지/시작하는 Hook
 * 전역 상태와 연동되어 각 미디어 타입별로 독립 관리
 */
export const useMediaToggle = (
  deviceKind: MediaDeviceKind,
  options: MediaToggleOptions = {},
) => {
  const {
    deviceId,
    onError,
    onDeviceChange,
    onPermissionDenied,
    audioElement,
  } = options;
  const currentStreamRef = useRef<MediaStream | null>(null);
  const permissionDeniedRef = useRef(false);
  const initializedRef = useRef(false);

  // 미디어 타입 매핑
  const mediaType: MediaType =
    deviceKind === 'videoinput'
      ? 'video'
      : deviceKind === 'audioinput'
        ? 'audio'
        : 'speaker';

  // 전역 상태에서 현재 미디어 상태 가져오기 (최적화된 셀렉터)
  const mediaState = useMediaControlStore((state) => state[mediaType]);

  // 액션들을 개별 셀렉터로 최적화하여 구독
  const setMediaEnabled = useMediaControlStore((s) => s.setMediaEnabled);
  const setMediaPending = useMediaControlStore((s) => s.setMediaPending);
  const setMediaError = useMediaControlStore((s) => s.setMediaError);
  const setDeviceId = useMediaControlStore((s) => s.setDeviceId);
  const setStream = useMediaControlStore((s) => s.setStream);
  const setSpeakerVolume = useMediaControlStore((s) => s.setSpeakerVolume);

  // 미디어 스트림 생성
  const createMediaStream = useCallback(
    async (targetDeviceId?: string): Promise<MediaStream> => {
      const finalDeviceId = targetDeviceId || deviceId;

      if (deviceKind === 'videoinput') {
        return await navigator.mediaDevices.getUserMedia({
          video: finalDeviceId
            ? {
                deviceId: { exact: finalDeviceId },
                ...CAMERA_CONSTRAINTS,
              }
            : CAMERA_CONSTRAINTS,
          audio: false,
        });
      }

      if (deviceKind === 'audioinput') {
        return await navigator.mediaDevices.getUserMedia({
          audio: finalDeviceId
            ? {
                deviceId: { exact: finalDeviceId },
                ...MICROPHONE_CONSTRAINTS,
              }
            : MICROPHONE_CONSTRAINTS,
          video: false,
        });
      }

      throw new Error(`Unsupported device kind for stream: ${deviceKind}`);
    },
    [deviceKind, deviceId],
  );

  // 현재 스트림 정리
  const stopCurrentStream = useCallback(() => {
    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach((track) => {
        track.stop(); // 물리적 디바이스 해제
      });
      currentStreamRef.current = null;
    }
  }, []);

  // 토글 기능
  const toggle = useCallback(
    async (forceState?: boolean, targetDeviceId?: string) => {
      const toggleCurrentState = useMediaControlStore.getState()[mediaType];
      const nextEnabled = forceState ?? !toggleCurrentState.isEnabled;

      setMediaPending(mediaType, true);
      setMediaError(mediaType, null);

      try {
        if (deviceKind === 'audiooutput') {
          // 스피커 토글 (음소거/해제)
          if (audioElement) {
            audioElement.muted = !nextEnabled;
            setSpeakerVolume(nextEnabled ? 1 : 0);
          }

          setMediaEnabled(mediaType, nextEnabled);
          setMediaPending(mediaType, false);

          // 디바이스 변경 콜백 호출
          if (targetDeviceId && onDeviceChange) {
            onDeviceChange(deviceKind, targetDeviceId);
          }
          return;
        }

        if (nextEnabled) {
          // 활성화: 새로운 스트림 생성
          const newStream = await createMediaStream(targetDeviceId);

          // 기존 스트림 정리
          stopCurrentStream();

          currentStreamRef.current = newStream;
          setStream(mediaType, newStream);
          setMediaEnabled(mediaType, true);
          setMediaPending(mediaType, false);

          // 디바이스 변경 콜백 호출
          if (targetDeviceId && onDeviceChange) {
            onDeviceChange(deviceKind, targetDeviceId);
          }
        } else {
          // 비활성화: 스트림 완전 중지
          stopCurrentStream();
          setStream(mediaType, null);
          setMediaEnabled(mediaType, false);
          setMediaPending(mediaType, false);
        }
      } catch (error) {
        const err = error as Error;
        setMediaPending(mediaType, false);
        setMediaError(mediaType, err);

        // 권한 거부 에러인 경우 콜백 호출
        if (
          err.name === 'NotAllowedError' ||
          err.name === 'PermissionDeniedError'
        ) {
          permissionDeniedRef.current = true;
          onPermissionDenied?.();
        }

        onError?.(err);
      }
    },
    [
      createMediaStream,
      stopCurrentStream,
      deviceKind,
      mediaType,
      audioElement,
      setMediaEnabled,
      setMediaPending,
      setMediaError,
      setStream,
      setSpeakerVolume,
      onDeviceChange,
      onError,
      onPermissionDenied,
    ],
  );

  // 디바이스 변경
  const changeDevice = useCallback(
    async (newDeviceId: string) => {
      // 동일성 비교: 동일한 디바이스 ID면 no-op
      const changeCurrentState = useMediaControlStore.getState()[mediaType];
      if (changeCurrentState.deviceId === newDeviceId) {
        return;
      }

      // 전역 상태에 디바이스 ID 저장
      setDeviceId(mediaType, newDeviceId);

      if (deviceKind === 'audiooutput') {
        // 스피커 디바이스 변경
        if (audioElement && 'setSinkId' in audioElement) {
          try {
            await (
              audioElement as HTMLAudioElement & {
                setSinkId: (id: string) => Promise<void>;
              }
            ).setSinkId(newDeviceId);
            onDeviceChange?.(deviceKind, newDeviceId);
          } catch (error) {
            console.warn('Failed to change speaker device:', error);
          }
        }
        return;
      }

      if (!changeCurrentState.isEnabled) {
        // 비활성화 상태에서는 디바이스 ID만 업데이트
        onDeviceChange?.(deviceKind, newDeviceId);
        return;
      }

      // 활성화 상태에서는 새로운 디바이스로 스트림 재생성
      await toggle(true, newDeviceId);
    },
    [toggle, deviceKind, mediaType, audioElement, setDeviceId, onDeviceChange],
  );

  // 컴포넌트 마운트 시 localStorage 설정과 동기화
  useEffect(() => {
    if (initializedRef.current) return;

    const syncInitialState = async () => {
      if (deviceKind === 'audiooutput') return;

      const { isEnabled, stream, isPending } = mediaState;

      // localStorage에서 활성화되어 있지만 실제 스트림이 없는 경우 즉시 동기화
      // 단, 이미 권한이 거부된 경우는 재시도하지 않음
      if (isEnabled && !stream && !isPending && !permissionDeniedRef.current) {
        initializedRef.current = true; // 초기화 시작 표시
        try {
          await toggle(true);
        } catch (error) {
          const err = error as Error;

          // 권한 관련 에러인 경우 더 이상 시도하지 않음
          if (
            err.name === 'NotAllowedError' ||
            err.name === 'PermissionDeniedError'
          ) {
            permissionDeniedRef.current = true;
            onPermissionDenied?.();
          }

          // 미디어 접근 실패 시 localStorage 설정을 실제 상태에 맞게 업데이트
          console.warn(`Failed to sync initial ${mediaType} state:`, error);
          setMediaEnabled(mediaType, false);
        }
      }
    };

    syncInitialState();
  }, [deviceKind, mediaType]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopCurrentStream();
    };
  }, [stopCurrentStream]);

  return {
    isEnabled: mediaState.isEnabled,
    isPending: mediaState.isPending || false,
    stream: mediaState.stream || null,
    error: mediaState.error || null,
    volume: mediaState.volume,
    toggle,
    changeDevice,
  };
};
