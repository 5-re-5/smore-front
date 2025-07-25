import { useEffect, useRef } from 'react';
import type { AudioPlayerProps } from '../types';

export function useAttachAudioTrack({ track }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    track.attach(audioEl);

    return () => {
      track.detach(audioEl);
    };
  }, [track]);

  return audioRef;
}
