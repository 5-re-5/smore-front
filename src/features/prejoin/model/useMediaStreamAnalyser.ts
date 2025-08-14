import { useEffect, useRef, useState } from 'react';

export function useMediaStreamAnalyser(stream: MediaStream | null) {
  const [level, setLevel] = useState(0); // 0 ~ 1
  const rafRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    if (!stream) {
      setLevel(0);
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      setLevel(0);
      return;
    }

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128; // 주파수 정밀도

    // MediaStream을 오디오 소스로 연결
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    // refs에 저장하여 cleanup에서 사용
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceRef.current = source;

    // // 바이트 단위 (8비트) Array
    const dataArray = new Uint8Array(analyser.frequencyBinCount); // 주파수 세기 초기화

    const update = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray); // 주파수 세기 측정
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setLevel(average / 256); // Normalize to 0 ~ 1
      rafRef.current = requestAnimationFrame(update);
    };

    update();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }

      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [stream]);

  return { level };
}
