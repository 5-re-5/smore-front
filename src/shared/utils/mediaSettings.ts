interface MediaSettings {
  video: boolean;
  audio: boolean;
  speaker: boolean;
}

const MEDIA_SETTINGS_KEY = 'smore-media-settings';

const DEFAULT_SETTINGS: MediaSettings = {
  video: false,
  audio: false,
  speaker: true,
};

export const saveMediaSettings = (settings: MediaSettings): void => {
  try {
    localStorage.setItem(MEDIA_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('미디어 설정 저장 실패:', error);
  }
};

export const loadMediaSettings = (): MediaSettings => {
  try {
    const stored = localStorage.getItem(MEDIA_SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 타입 검증
      if (
        typeof parsed === 'object' &&
        typeof parsed.video === 'boolean' &&
        typeof parsed.audio === 'boolean' &&
        typeof parsed.speaker === 'boolean'
      ) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('미디어 설정 로드 실패:', error);
  }
  return DEFAULT_SETTINGS;
};

export const clearMediaSettings = (): void => {
  try {
    localStorage.removeItem(MEDIA_SETTINGS_KEY);
  } catch (error) {
    console.warn('미디어 설정 삭제 실패:', error);
  }
};

export type { MediaSettings };
