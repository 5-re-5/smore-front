import {
  useRejoinRoomMutation,
  useRoomInfoQuery,
  useRoomToken,
} from '@/entities/room/api/queries';
import type { ApiError } from '@/shared/api/request';
import { adaptRoomFromApi } from '@/entities/room/model/adapters';
import { useAuth } from '@/entities/user';
import { useRoomParticipantQuery } from '@/entities/user/api/queries/userQueries';
import { usePomodoroStore } from '@/features/pomodoro';
import { useRoomStateStore } from '@/features/room';
import { useStopwatchStore } from '@/features/stopwatch';
import { LIVEKIT_WS_URL } from '@/shared/config/livekit';
import { useMediaSync } from '@/shared/hooks/useMediaSync';
import { SmoreLogoHeader } from '@/shared/ui';
import { Button } from '@/shared/ui/button';
import { PermissionBanner } from '@/shared/ui/permission-banner';
import { loadMediaSettings } from '@/shared/utils/mediaSettings';
import {
  canUseMedia,
  checkAllMediaPermissions,
  type MediaPermissionStatus,
} from '@/shared/utils/permissionUtils';
import { cleanupAllMediaTracks } from '@/shared/utils/trackCleanup';
import { RoomLayout } from '@/widgets';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from '@livekit/components-react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { DisconnectReason } from 'livekit-client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

function RoomPage() {
  const { roomId } = useParams({ from: '/room/$roomId' });
  const navigate = useNavigate();
  const rejoinMutation = useRejoinRoomMutation();
  const { userId } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected' | 'error'
  >('connecting');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [autoRejoinStatus, setAutoRejoinStatus] = useState<
    'idle' | 'attempting' | 'success' | 'failed'
  >('idle');
  const resetStopwatch = useStopwatchStore((state) => state.resetStopwatch);
  const resetTimer = usePomodoroStore((state) => state.resetTimer);
  const updateServerData = useStopwatchStore((state) => state.updateServerData);
  const { setOwner, setRoomSettings } = usePomodoroStore();
  const [retryCount, setRetryCount] = useState<number>(0);

  const { isIntentionalExit, clearIntentionalExit } = useRoomStateStore();
  // 저장된 미디어 설정 로드
  const [mediaSettings] = useState(() => loadMediaSettings());

  // 권한 상태 관리
  const [permissionStatus, setPermissionStatus] =
    useState<MediaPermissionStatus | null>(null);
  const [actualMediaSettings, setActualMediaSettings] = useState(mediaSettings);

  // 스피커 상태 관리
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(() => {
    return !loadMediaSettings().speaker;
  });

  // roomId 유효성 검사
  const roomIdNumber = parseInt(roomId, 10);
  const queryClient = useQueryClient();

  const handleRetryConnection = () => {
    const newRetryCount = retryCount + 1;
    setRetryCount(newRetryCount);
    setConnectionStatus('connecting');
    setErrorMessage('');

    if (newRetryCount >= 3) {
      // 3번 이상 재시도 시 페이지 새로고침
      window.location.reload();
    }
  };

  // 권한 확인 및 실제 미디어 설정 업데이트
  const checkPermissionsAndUpdateSettings = useCallback(async () => {
    try {
      const permissions = await checkAllMediaPermissions();
      setPermissionStatus(permissions);

      // 현재 mediaSettings를 최신으로 가져오기
      const currentMediaSettings = loadMediaSettings();

      // 권한 상태에 따라 실제 사용할 미디어 설정 결정
      const actualVideo = canUseMedia(
        permissions.video,
        currentMediaSettings.video,
      );
      const actualAudio = canUseMedia(
        permissions.audio,
        currentMediaSettings.audio,
      );

      setActualMediaSettings({
        ...currentMediaSettings,
        video: actualVideo,
        audio: actualAudio,
      });
    } catch (error) {
      console.warn('권한 확인 실패:', error);
      // 권한 확인 실패 시 안전하게 false로 설정
      const currentMediaSettings = loadMediaSettings();
      setActualMediaSettings({
        ...currentMediaSettings,
        video: false,
        audio: false,
      });
    }
  }, []); // mediaSettings 의존성 제거 - 내부에서 최신 값 직접 로드

  // 저장된 토큰 조회
  const token = useRoomToken(roomIdNumber);

  // 방 정보 조회
  const { data: roomInfoData } = useRoomInfoQuery(roomIdNumber);
  const roomInfo = roomInfoData ? adaptRoomFromApi(roomInfoData) : null;

  // 방 참가자 정보 조회
  const { data: participantData } = useRoomParticipantQuery(
    roomIdNumber,
    userId || 0,
  );

  // 미디어 동기화 훅
  const { sendInitialMediaSettings } = useMediaSync({
    roomId: roomIdNumber,
    userId: userId || 0,
    onError: (error) => {
      console.error('미디어 설정 동기화 실패:', error);
    },
  });

  // 자동 재입장 시도
  const attemptAutoRejoin = useCallback(async () => {
    if (!userId || autoRejoinStatus === 'attempting') {
      return;
    }

    setAutoRejoinStatus('attempting');

    rejoinMutation.mutate(
      { roomId: roomIdNumber, userId },
      {
        onSuccess: () => {
          setAutoRejoinStatus('success');
        },
        onError: (error) => {
          console.error('자동 재입장 실패:', error);
          setAutoRejoinStatus('failed');

          // 406 에러인 경우 방이 삭제된 것으로 처리
          if ((error as ApiError).code === 406) {
            toast.error('방이 삭제되었습니다.');
            navigate({ to: '/study-list' });
            return;
          }

          setErrorMessage('방에 재입장할 수 없습니다.');
          navigate({
            to: '/room/$roomId/prejoin',
            params: { roomId },
          });
        },
      },
    );
  }, [
    roomIdNumber,
    userId,
    rejoinMutation,
    navigate,
    roomId,
    autoRejoinStatus,
  ]);

  // 권한 확인 초기화
  useEffect(() => {
    checkPermissionsAndUpdateSettings();
  }, [checkPermissionsAndUpdateSettings]);

  // 미디어 동기화 함수 ref
  const sendInitialMediaSettingsRef = useRef(sendInitialMediaSettings);
  sendInitialMediaSettingsRef.current = sendInitialMediaSettings;

  // 초기 미디어 설정 서버 동기화
  useEffect(() => {
    if (actualMediaSettings && userId && roomIdNumber) {
      sendInitialMediaSettingsRef.current({
        audioEnabled: actualMediaSettings.audio,
        videoEnabled: actualMediaSettings.video,
      });
    }
  }, [actualMediaSettings, userId, roomIdNumber]); // sendInitialMediaSettings 의존성 제거

  // 방 정보 및 참가자 데이터 동기화
  useEffect(() => {
    if (roomInfo) {
      // 뽀모도로 방 설정 동기화 (null이면 기본값 사용)
      setRoomSettings(roomInfo.focusTime, roomInfo.breakTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomInfo?.focusTime, roomInfo?.breakTime]);

  useEffect(() => {
    if (participantData) {
      // 뽀모도로 권한 설정
      setOwner(participantData.isOwner);

      // 스톱워치 서버 데이터 동기화
      updateServerData(
        participantData.todayStudyTime,
        participantData.targetStudyTime,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    participantData?.isOwner,
    participantData?.todayStudyTime,
    participantData?.targetStudyTime,
  ]);

  useEffect(() => {
    // 잘못된 roomId인 경우 홈으로 리다이렉트
    if (isNaN(roomIdNumber)) {
      navigate({ to: '/study-list' });
      return;
    }

    // 의도적 나가기인 경우 즉시 study-list로 이동
    if (isIntentionalExit(roomIdNumber)) {
      navigate({ to: '/study-list' });
      return;
    }

    // 토큰이 없는 경우 자동 재입장 시도 (의도적 나가기가 아닌 경우에만)
    if (!token && autoRejoinStatus === 'idle' && userId) {
      attemptAutoRejoin();
      return;
    }

    // 토큰이 없고 사용자 정보도 없는 경우 prejoin으로 이동
    if (!token && !userId) {
      setErrorMessage('다시 입장해주세요.');
      navigate({
        to: '/room/$roomId/prejoin',
        params: { roomId },
      });
      return;
    }
  }, [
    roomId,
    roomIdNumber,
    token,
    userId,
    autoRejoinStatus,
    navigate,
    attemptAutoRejoin,
    isIntentionalExit,
    clearIntentionalExit,
  ]);

  // 스피커 토글 이벤트 감지하여 상태 동기화
  useEffect(() => {
    const handleSpeakerToggle = () => {
      const newSettings = loadMediaSettings();
      setIsSpeakerMuted(!newSettings.speaker);
    };

    window.addEventListener('speakerToggle', handleSpeakerToggle);
    return () => {
      window.removeEventListener('speakerToggle', handleSpeakerToggle);
    };
  }, []);

  // 스톱워치 초기화
  useEffect(() => {
    return () => resetStopwatch();
  }, [resetStopwatch]);

  useEffect(() => {
    return () => resetTimer();
  }, [resetTimer]);

  // 브라우저 종료 시에만 track 정리 (탭 전환 시에는 정리하지 않음)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // 실제 브라우저 종료/새로고침 시에만 MediaTrack 정리
      cleanupAllMediaTracks();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 토큰이 없거나 재입장 중이면 로딩 상태
  if (!token || autoRejoinStatus === 'attempting') {
    return (
      <div className="fixed inset-0 bg-[#101214] bg-opacity-95 flex flex-col items-center justify-center z-51 min-h-screen gap-6">
        <SmoreLogoHeader />
        <div className="text-center">
          <div className="mx-auto mb-4 w-8 h-8 rounded-full border-b-2 border-blue-600 animate-spin"></div>
          <p className="text-lg text-white">
            {autoRejoinStatus === 'attempting'
              ? '방에 재입장 중'
              : '스터디룸에 연결 중'}
          </p>
        </div>
      </div>
    );
  }

  // 연결 오류 상태 표시
  if (connectionStatus === 'error') {
    return (
      <div className="flex flex-col justify-center items-center p-4 min-h-screen">
        <div className="max-w-md text-center">
          <h2 className="mb-4 text-xl font-semibold text-red-600">연결 실패</h2>
          <p className="mb-4 text-gray-600">
            화상회의 서버에 연결할 수 없습니다.
          </p>
          {errorMessage && (
            <p className="mb-4 text-sm text-gray-500">오류: {errorMessage}</p>
          )}
          <div className="space-y-2">
            <Button onClick={handleRetryConnection} className="w-full">
              다시 시도 {retryCount > 0 && `(${retryCount}/3)`}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/study-list' })}
              className="w-full"
            >
              스터디 목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#101214]">
      {permissionStatus && (
        <PermissionBanner
          permissionStatus={permissionStatus}
          userPreferences={{
            video: mediaSettings.video,
            audio: mediaSettings.audio,
          }}
        />
      )}

      {connectionStatus === 'connecting' && (
        <div className="fixed inset-0 bg-[#101214] bg-opacity-95 flex flex-col items-center justify-center z-51 min-h-screen gap-6">
          <SmoreLogoHeader />
          <div className="text-center">
            <div className="mx-auto mb-4 w-8 h-8 rounded-full border-b-2 border-blue-600 animate-spin"></div>
            <p className="text-lg text-white">화상 회의에 연결중</p>
            {retryCount > 0 && (
              <p className="mt-2 text-sm text-gray-500">
                재시도 {retryCount}회
              </p>
            )}
          </div>
        </div>
      )}

      <LiveKitRoom
        token={token}
        serverUrl={LIVEKIT_WS_URL}
        connect
        video={actualMediaSettings.video}
        audio={actualMediaSettings.audio}
        options={{
          adaptiveStream: true,
          dynacast: true,
          publishDefaults: {
            simulcast: true,
          },
        }}
        onConnected={async () => {
          setConnectionStatus('connected');
          setRetryCount(0); // 성공 시 재시도 카운트 리셋
          clearIntentionalExit(roomIdNumber); // 의도적 나가기 플래그 리셋
        }}
        onDisconnected={(reason?: DisconnectReason) => {
          queryClient.invalidateQueries({ queryKey: ['recentStudy'] });
          queryClient.invalidateQueries({ queryKey: ['study-rooms'] });
          queryClient.invalidateQueries({ queryKey: ['room'] });
          toast.error('룸 연결이 해제되었습니다.');
          navigate({ to: '/study-list' });
          if (reason && reason !== DisconnectReason.CLIENT_INITIATED) {
            setConnectionStatus('disconnected');
            setErrorMessage(`연결이 해제되었습니다: ${reason}`);
          }
        }}
        onError={(error) => {
          // 연결 오류 시 자동 재시도 (최대 3회)
          if (retryCount < 3) {
            setTimeout(
              () => {
                handleRetryConnection();
              },
              2000 * Math.pow(2, retryCount),
            ); // exponential backoff
          } else {
            setConnectionStatus('error');
            setErrorMessage(error.message || '알 수 없는 오류가 발생했습니다.');
          }
        }}
        className="flex-1"
      >
        {!isSpeakerMuted && <RoomAudioRenderer />}
        <StartAudio label="" />
        <RoomLayout
          roomIdNumber={roomIdNumber}
          isOwner={participantData?.isOwner || false}
          isPomodoro={!!roomInfo?.focusTime}
          roomTitle={roomInfo?.title}
        />
      </LiveKitRoom>
    </div>
  );
}

export default RoomPage;
