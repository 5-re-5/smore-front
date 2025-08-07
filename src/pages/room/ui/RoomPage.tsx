import { useJoinTokenQuery } from '@/entities/room/api/queries';
import { LIVEKIT_WS_URL } from '@/shared/config/livekit';
import { RoomLayout } from '@/widgets';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from '@livekit/components-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';

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

  // roomId 유효성 검사
  const roomIdNumber = parseInt(roomId, 10);

  // 저장된 토큰 조회
  const { data: joinTokenData } = useJoinTokenQuery(roomIdNumber);
  const token = joinTokenData?.accessToken;

  useEffect(() => {
    // 잘못된 roomId인 경우 홈으로 리다이렉트
    if (isNaN(roomIdNumber)) {
      navigate({ to: '/' });
      return;
    }

    // 토큰이 없는 경우 prejoin 페이지로 리다이렉트
    if (!token) {
      alert('방의 토큰이 존재하지 않습니다.');
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

  return (
    <LiveKitRoom token={token} serverUrl={LIVEKIT_WS_URL} connect video audio>
      <RoomAudioRenderer />
      <StartAudio label="오디오 시작하기" />
      <RoomLayout />
    </LiveKitRoom>
  );
}

export default RoomPage;
