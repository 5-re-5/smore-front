import { useEffect, useRef, useState } from 'react';
import { LocalAudioTrack } from 'livekit-client';

export function useMicAnalyser(track: LocalAudioTrack | undefined) {
  const [level, setLevel] = useState(0); // 0 ~ 1
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!track) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;

    const source = audioContext.createMediaStreamSource(
      new MediaStream([track.mediaStreamTrack]),
    );
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const update = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setLevel(average / 256); // Normalize to 0 ~ 1
      rafRef.current = requestAnimationFrame(update);
    };

    update();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      source.disconnect();
      analyser.disconnect();
      audioContext.close();
    };
  }, [track]);

  return { level };
}
