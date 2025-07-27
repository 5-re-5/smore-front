import { getLivekitToken } from '@/shared/api/getLivekitToken';
import { LIVEKIT_WS_URL } from '@/shared/config/livekit';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  VideoConference,
} from '@livekit/components-react';
import { useSearch } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

function RoomPage() {
  const { roomName } = useSearch({ from: '/room' });
  const participantNameRef = useRef('User' + Math.floor(Math.random() * 1000));
  const participantName = participantNameRef.current;

  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const newToken = await getLivekitToken(roomName, participantName);
        setToken(newToken);
      } catch (e) {
        setError((e as Error).message);
      }
    };
    fetchToken();
  }, []);

  if (error) return <div>토큰 에러: {error}</div>;
  if (!token) return <div>로딩 중...</div>;

  return (
    <LiveKitRoom token={token} serverUrl={LIVEKIT_WS_URL} connect video audio>
      <RoomAudioRenderer />
      <StartAudio label="오디오 시작하기" />
      <VideoConference />
    </LiveKitRoom>
  );
}

export default RoomPage;
