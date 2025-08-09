import {
  useLeaveRoomMutation,
  useRoomToken,
} from '@/entities/room/api/queries';
import { useAuth } from '@/entities/user';
import { LIVEKIT_WS_URL } from '@/shared/config/livekit';
import { Button } from '@/shared/ui/button';
import { RoomLayout } from '@/widgets';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from '@livekit/components-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { DisconnectReason } from 'livekit-client';
import { useEffect, useState } from 'react';

// 로딩 상태 컴포넌트
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <h2 className="text-xl font-semibold mt-4 text-gray-900">
        스터디룸에 연결 중...
      </h2>
      <p className="text-gray-600 mt-2">잠시만 기다려주세요</p>
    </div>
  </div>
);

function RoomPage() {
  const { roomId } = useParams({ from: '/room/$roomId' });
  const navigate = useNavigate();
  const leaveRoomMutation = useLeaveRoomMutation();
  const { userId } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected' | 'error'
  >('connecting');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [retryCount, setRetryCount] = useState<number>(0);

  // roomId 유효성 검사
  const roomIdNumber = parseInt(roomId, 10);

  const handleLeaveRoom = () => {
    if (!userId) {
      alert('사용자 정보가 없습니다.');
      return;
    }

    leaveRoomMutation.mutate(
      { roomId: roomIdNumber, userId },
      {
        onSuccess: () => {
          navigate({ to: '/study-list' });
        },
        onError: (error) => {
          console.error('방 나가기 실패:', error);
          alert('방 나가기에 실패했습니다.');
        },
      },
    );
  };

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

  // 저장된 토큰 조회
  const token = useRoomToken(roomIdNumber);

  useEffect(() => {
    // 잘못된 roomId인 경우 홈으로 리다이렉트
    if (isNaN(roomIdNumber)) {
      navigate({ to: '/study-list' });
      return;
    }

    // 토큰이 없는 경우 prejoin 페이지로 리다이렉트
    if (!token) {
      setErrorMessage('다시 입장해주세요.');
      navigate({
        to: '/room/$roomId/prejoin',
        params: { roomId },
      });
      return;
    }
  }, [roomId, roomIdNumber, token, navigate]);

  // 토큰이 없으면 로딩 상태 (리다이렉트 전까지)
  if (!token) {
    return <LoadingState />;
  }

  // 연결 오류 상태 표시
  if (connectionStatus === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">연결 실패</h2>
          <p className="text-gray-600 mb-4">
            화상회의 서버에 연결할 수 없습니다.
          </p>
          {errorMessage && (
            <p className="text-sm text-gray-500 mb-4">오류: {errorMessage}</p>
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
    <div className="relative">
      <Button
        onClick={handleLeaveRoom}
        variant="destructive"
        className="absolute top-4 right-4 z-50 text-white"
        disabled={leaveRoomMutation.isPending}
      >
        {leaveRoomMutation.isPending ? '나가는 중...' : '방 나가기'}
      </Button>

      {connectionStatus === 'connecting' && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p>화상회의에 연결 중...</p>
            {retryCount > 0 && (
              <p className="text-sm text-gray-500">재시도 {retryCount}회</p>
            )}
          </div>
        </div>
      )}

      <LiveKitRoom
        token={token}
        serverUrl={LIVEKIT_WS_URL}
        connect
        video
        audio
        options={{
          adaptiveStream: true,
          dynacast: true,
          publishDefaults: {
            simulcast: true,
          },
        }}
        onConnected={() => {
          setConnectionStatus('connected');
          setRetryCount(0); // 성공 시 재시도 카운트 리셋
        }}
        onDisconnected={(reason?: DisconnectReason) => {
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
      >
        <RoomAudioRenderer />
        <StartAudio label="오디오 시작하기" />
        <RoomLayout />
      </LiveKitRoom>
    </div>
  );
}

export default RoomPage;
