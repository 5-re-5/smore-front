export type MediaPermissionState = 'granted' | 'denied' | 'prompt' | 'unknown';

export interface MediaPermissionStatus {
  video: MediaPermissionState;
  audio: MediaPermissionState;
}

export const checkMediaPermission = async (
  type: 'camera' | 'microphone',
): Promise<MediaPermissionState> => {
  if (!navigator.permissions) {
    return 'unknown';
  }

  try {
    const permissionName = type === 'camera' ? 'camera' : 'microphone';
    const permission = await navigator.permissions.query({
      name: permissionName as PermissionName,
    });
    return permission.state as MediaPermissionState;
  } catch (error) {
    console.warn(`Failed to check ${type} permission:`, error);
    return 'unknown';
  }
};

export const checkAllMediaPermissions =
  async (): Promise<MediaPermissionStatus> => {
    const [videoPermission, audioPermission] = await Promise.all([
      checkMediaPermission('camera'),
      checkMediaPermission('microphone'),
    ]);

    return {
      video: videoPermission,
      audio: audioPermission,
    };
  };

export const canUseMedia = (
  permissionState: MediaPermissionState,
  userPreference: boolean,
): boolean => {
  if (!userPreference) return false;
  return permissionState === 'granted';
};

export const shouldShowPermissionAlert = (
  permissionState: MediaPermissionState,
): boolean => {
  return permissionState === 'denied';
};

export const shouldRequestPermission = (
  permissionState: MediaPermissionState,
): boolean => {
  return permissionState === 'prompt' || permissionState === 'unknown';
};

export const getPermissionMessage = (
  type: 'video' | 'audio',
  permissionState: MediaPermissionState,
): string => {
  const mediaType = type === 'video' ? '카메라' : '마이크';

  switch (permissionState) {
    case 'denied':
      return `${mediaType} 권한이 거부되어 있습니다. 브라우저 설정에서 권한을 허용해주세요.`;
    case 'prompt':
      return `${mediaType} 권한을 요청합니다.`;
    case 'unknown':
      return `${mediaType} 권한 상태를 확인할 수 없습니다.`;
    default:
      return `${mediaType} 권한이 허용되었습니다.`;
  }
};

export const getBrowserPermissionGuideUrl = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes('chrome')) {
    return 'https://support.google.com/chrome/answer/2693767';
  } else if (userAgent.includes('firefox')) {
    return 'https://support.mozilla.org/ko/kb/how-manage-your-camera-and-microphone-permissions';
  } else if (userAgent.includes('safari')) {
    return 'https://support.apple.com/guide/safari/website-settings-for-camera-and-microphone-ibrwe2159f50/mac';
  } else if (userAgent.includes('edge')) {
    return 'https://support.microsoft.com/ko-kr/microsoft-edge/website-permissions-in-microsoft-edge-0717d4d1-8c0a-4c9f-9b8e-4b37a8da4644';
  }

  return 'https://support.google.com/chrome/answer/2693767'; // 기본값
};
