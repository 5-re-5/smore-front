import { getLivekitToken } from '@/shared/api/getLivekitToken';
import { LIVEKIT_WS_URL } from '@/shared/config/livekit';
import { RoomLayout } from '@/widgets';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from '@livekit/components-react';
import { useParams, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

function RoomPage() {
  const { roomId } = useParams({ from: '/room/$roomId' });
  const navigate = useNavigate();
  const search = useSearch({ from: '/room/$roomId' });
  const participantNameRef = useRef('User' + Math.floor(Math.random() * 1000));
  const participantName = participantNameRef.current;

  // roomName은 roomId를 문자열로 사용 (나중에 실제 방 이름으로 변경 가능)
  const roomName = `room-${roomId}`;

  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // roomId 유효성 검사
  const roomIdNumber = parseInt(roomId, 10);

  useEffect(() => {
    // 잘못된 roomId인 경우 홈으로 리다이렉트
    if (isNaN(roomIdNumber)) {
      navigate({ to: '/' });
      return;
    }

    // prejoin 완료하지 않았으면 prejoin 페이지로 리다이렉트
    const hasPrejoinCompleted = !!(search as { prejoinCompleted?: string })
      .prejoinCompleted;

    if (!hasPrejoinCompleted) {
      navigate({ to: '/room/$roomId/prejoin', params: { roomId } });
      return;
    }

    // prejoin 완료된 경우 LiveKit 토큰 발급
    const fetchToken = async () => {
      try {
        const newToken = await getLivekitToken(roomName, participantName);
        setToken(newToken);
      } catch (e) {
        setError((e as Error).message);
      }
    };
    fetchToken();
  }, [roomId, roomIdNumber, navigate, roomName, participantName, search]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">연결 오류</h1>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
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
