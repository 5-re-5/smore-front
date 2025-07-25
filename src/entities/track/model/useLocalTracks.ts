import { useEffect, useState } from 'react';
import {
  LocalAudioTrack,
  LocalVideoTrack,
  createLocalTracks,
} from 'livekit-client';

// !테스트용, room 연결하면 필요 없음
export function useLocalTracks() {
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
  const [audioTrack, setAudioTrack] = useState<LocalAudioTrack>();

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const tracks = await createLocalTracks({ video: true, audio: true });
        for (const track of tracks) {
          if (!active) return;
          if (track.kind === 'video') setVideoTrack(track as LocalVideoTrack);
          if (track.kind === 'audio') setAudioTrack(track as LocalAudioTrack);
        }
      } catch (e) {
        console.error('🎥🎤 트랙 초기화 실패', e);
      }
    })();

    return () => {
      active = false;
      videoTrack?.stop();
      audioTrack?.stop();
    };
  }, []);

  return { videoTrack, audioTrack };
}
