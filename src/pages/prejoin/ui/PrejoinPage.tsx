import {
  useJoinRoomMutation,
  useRoomInfoQuery,
} from '@/entities/room/api/queries';
import { adaptRoomFromApi } from '@/entities/room/model/adapters';
import { useAuth } from '@/entities/user/model/useAuth';
import { useUserInfo } from '@/entities/user/model/useUserInfo';
import { useFaceDetectionStore } from '@/features/face-detection/model/useFaceDetectionStore';
import { PrejoinMicWaveform, useAudioState } from '@/features/prejoin';
import { useMediaControlStore } from '@/features/prejoin/model/useMediaControlStore';
import { CameraPreview } from '@/features/prejoin/ui/CameraPreview';
import { RoomInfo } from '@/features/prejoin/ui/RoomInfo';
import type { ApiError } from '@/shared/api/request';
import { Button } from '@/shared/ui/button';
import { ArrowIcon } from '@/shared/ui/icons';
import { SmoreLogoHeader } from '@/shared/ui';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const RoomNotFoundAlert = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const navigate = useNavigate();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>방을 찾을 수 없습니다</AlertDialogTitle>
          <AlertDialogDescription>
            존재하지 않는 방입니다. 스터디 목록으로 이동하여 다른 방을
            선택해주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              onOpenChange(false);
              navigate({ to: '/study-list' });
            }}
          >
            목록으로 이동
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

function PrejoinPage() {
  const { roomId } = useParams({ from: '/room/$roomId/prejoin' });
  const navigate = useNavigate();
  const isValidRoomId = /^\d+$/.test(roomId);
  const roomIdNumber = isValidRoomId ? parseInt(roomId, 10) : NaN;
  const audioState = useAudioState();
  const stopAllMedia = useMediaControlStore((s) => s.stopAllMedia);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showRoomNotFoundAlert, setShowRoomNotFoundAlert] = useState(false);

  // 사용자 정보
  const { getUserId } = useAuth();
  const userId = getUserId();
  const { data: userInfo } = useUserInfo();
  const identity =
    userInfo?.nickname || `User${Math.floor(Math.random() * 1000)}`;

  // 방 정보 조회
  const { data: roomData, isLoading: roomLoading } =
    useRoomInfoQuery(roomIdNumber);
  const room = roomData ? adaptRoomFromApi(roomData) : null;

  // 방 입장 mutation
  const joinRoomMutation = useJoinRoomMutation();
  const isJoining = joinRoomMutation.isPending;

  // 얼굴 감지 설정
  const { isFaceDetectionEnabled, setFaceDetectionEnabled } =
    useFaceDetectionStore();

  // 컴포넌트 언마운트 시 전체 미디어 정리
  useEffect(() => {
    return () => {
      stopAllMedia();
    };
  }, [stopAllMedia]);

  const validatePassword = (): boolean => {
    if (room?.hasPassword && !password.trim()) {
      setError('비밀번호를 입력해주세요.');
      return false;
    }
    return true;
  };

  const getErrorMessage = (apiError: ApiError): string => {
    switch (apiError.code) {
      case 401:
        return '비밀번호가 올바르지 않습니다.';
      case 404:
        return '존재하지 않는 방입니다.';
      case 409:
        return '방이 가득 찼습니다. 나중에 다시 시도해주세요.';
      default:
        return '방 입장에 실패했습니다. 다시 시도해주세요.';
    }
  };

  const navigateToRoom = (): void => {
    navigate({
      to: '/room/$roomId',
      params: { roomId },
    });
  };

  const handleGoBack = (): void => {
    navigate({
      to: '/study-list',
    });
  };

  const handleJoinRoom = async (): Promise<void> => {
    if (!validatePassword()) return;
    if (!userId) {
      setError('사용자 정보를 불러올 수 없습니다.');
      return;
    }

    setError(null);

    try {
      await joinRoomMutation.mutateAsync({
        roomId: roomIdNumber,
        userId,
        identity,
        password: room?.hasPassword ? password : undefined,
      });
      navigateToRoom();
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.code === 400) {
        setShowRoomNotFoundAlert(true);
        return;
      }

      setError(getErrorMessage(apiError));
    }
  };

  if (isNaN(roomIdNumber)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-red-600">잘못된 방 번호</h1>
          <p className="text-gray-600">유효한 방 번호를 입력해주세요.</p>
          <Button onClick={handleGoBack}> 목록으로 이동</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="text-white hover:bg-white/10 hover:text-white"
            aria-label="목록으로 돌아가기"
          >
            <ArrowIcon className="rotate-180" />
          </Button>
          <SmoreLogoHeader />
          <div className="w-9" /> {/* 균형을 위한 spacer */}
        </div>
        <div className="h-full w-full bg-[#202020] rounded-lg shadow-lg p-14 px-10">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* 왼쪽: 카메라 미리보기 */}
            <section className="flex items-start space-x-4">
              <PrejoinMicWaveform stream={audioState.stream || null} />
              <div className="flex-1">
                <CameraPreview />
              </div>
            </section>

            {/* 오른쪽: 방 정보 및 입장 설정 */}
            <section className="space-y-6">
              <RoomInfo roomId={roomIdNumber} />
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">AI 설정</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        얼굴 감지 AI
                      </label>
                      <p className="text-sm text-gray-600">
                        얼굴 감지를 통해 집중도를 측정합니다
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFaceDetectionEnabled}
                        onChange={(e) =>
                          setFaceDetectionEnabled(e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              {/* 비밀번호 입력 - 비밀번호가 필요한 방만 표시 */}
              {room?.hasPassword && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">방 비밀번호</h3>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isJoining) {
                            handleJoinRoom();
                          }
                        }}
                      />
                    </div>
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI 설정 */}

              {/* 입장하기 버튼 */}
              <button
                onClick={handleJoinRoom}
                disabled={
                  isJoining ||
                  roomLoading ||
                  (room?.hasPassword && !password.trim())
                }
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isJoining ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    입장 중...
                  </>
                ) : (
                  '스터디룸 입장하기'
                )}
              </button>
            </section>
          </div>
        </div>
      </div>

      {/* 방을 찾을 수 없음 알림 */}
      <RoomNotFoundAlert
        open={showRoomNotFoundAlert}
        onOpenChange={setShowRoomNotFoundAlert}
      />
    </div>
  );
}

export default PrejoinPage;
