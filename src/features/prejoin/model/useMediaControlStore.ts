import { create } from 'zustand';
import {
  loadMediaSettings,
  saveMediaSettings,
} from '@/shared/utils/mediaSettings';

export type MediaType = 'video' | 'audio' | 'speaker';

interface MediaState {
  isEnabled: boolean;
  deviceId?: string;
  stream?: MediaStream | null;
  volume?: number; // 스피커용
  isPending?: boolean;
  error?: Error | null;
}

interface MediaControlState {
  video: MediaState;
  audio: MediaState;
  speaker: MediaState;
}

export interface MediaControlActions {
  // 미디어 활성화/비활성화
  setMediaEnabled: (type: MediaType, enabled: boolean) => void;
  setMediaPending: (type: MediaType, pending: boolean) => void;
  setMediaError: (type: MediaType, error: Error | null) => void;

  // 디바이스 선택
  setDeviceId: (type: MediaType, deviceId: string) => void;

  // 스트림 관리
  setStream: (type: MediaType, stream: MediaStream | null) => void;

  // 스피커 볼륨 관리
  setSpeakerVolume: (volume: number) => void;

  // 상태 초기화
  reset: () => void;

  // 모든 미디어 정지
  stopAllMedia: () => void;
}

const getInitialState = (): MediaControlState => {
  const savedSettings = loadMediaSettings();
  return {
    video: {
      isEnabled: savedSettings.video,
      stream: null,
      isPending: false,
      error: null,
    },
    audio: {
      isEnabled: savedSettings.audio,
      stream: null,
      isPending: false,
      error: null,
    },
    speaker: {
      isEnabled: savedSettings.speaker,
      volume: 1,
      isPending: false,
      error: null,
    },
  };
};

export const useMediaControlStore = create<
  MediaControlState & MediaControlActions
>((set, get) => ({
  ...getInitialState(),

  setMediaEnabled: (type, enabled) => {
    set((state) => ({
      ...state,
      [type]: {
        ...state[type],
        isEnabled: enabled,
      },
    }));

    // localStorage에 미디어 설정 저장
    const currentState = get();
    saveMediaSettings({
      video: type === 'video' ? enabled : currentState.video.isEnabled,
      audio: type === 'audio' ? enabled : currentState.audio.isEnabled,
      speaker: type === 'speaker' ? enabled : currentState.speaker.isEnabled,
    });
  },

  setMediaPending: (type, pending) =>
    set((state) => ({
      ...state,
      [type]: {
        ...state[type],
        isPending: pending,
      },
    })),

  setMediaError: (type, error) =>
    set((state) => ({
      ...state,
      [type]: {
        ...state[type],
        error,
      },
    })),

  setDeviceId: (type, deviceId) =>
    set((state) => ({
      ...state,
      [type]: {
        ...state[type],
        deviceId,
      },
    })),

  setStream: (type, stream) =>
    set((state) => ({
      ...state,
      [type]: {
        ...state[type],
        stream,
      },
    })),

  setSpeakerVolume: (volume) =>
    set((state) => ({
      ...state,
      speaker: {
        ...state.speaker,
        volume,
      },
    })),

  reset: () => set(getInitialState()),

  stopAllMedia: () => {
    const { video, audio } = get();

    // 비디오 스트림 정지
    if (video.stream) {
      video.stream.getTracks().forEach((track) => track.stop());
    }

    // 오디오 스트림 정지
    if (audio.stream) {
      audio.stream.getTracks().forEach((track) => track.stop());
    }

    set({
      video: { ...video, stream: null, isEnabled: false },
      audio: { ...audio, stream: null, isEnabled: false },
    });
  },
}));

// 편의 셀렉터들
export const useVideoState = () => useMediaControlStore((state) => state.video);
export const useAudioState = () => useMediaControlStore((state) => state.audio);
export const useSpeakerState = () =>
  useMediaControlStore((state) => state.speaker);

// 액션 셀렉터들
export const useMediaActions = () =>
  useMediaControlStore((state) => ({
    setMediaEnabled: state.setMediaEnabled,
    setMediaPending: state.setMediaPending,
    setMediaError: state.setMediaError,
    setDeviceId: state.setDeviceId,
    setStream: state.setStream,
    setSpeakerVolume: state.setSpeakerVolume,
    reset: state.reset,
    stopAllMedia: state.stopAllMedia,
  }));
