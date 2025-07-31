import { useEffect, useRef } from 'react';
import { useWhiteNoiseStore } from '../model/useWhiteNoiseStore';
import { getNoiseUrl } from '../config/noiseConfig';

// 오디오 재생만 담당하는 백그라운드 컴포넌트 (UI 없음)
const WhiteNoiseAudioManager = () => {
  const { currentNoise, volume, isPlaying, setIsPlaying } =
    useWhiteNoiseStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio 초기화 및 재생/일시정지 관리
  useEffect(() => {
    if (!currentNoise) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    // 기존 오디오 정리
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audioUrl = getNoiseUrl(currentNoise);
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = volume / 100;

    // 루프 끊김 방지를 위한 추가 설정
    audio.preload = 'auto';

    audioRef.current = audio;

    // 재생 상태에 따라 재생/일시정지
    if (isPlaying) {
      audio.play().catch(console.error);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentNoise, volume, isPlaying, setIsPlaying]);

  // 재생/일시정지 상태 변경
  useEffect(() => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      audioRef.current.pause();
      return;
    }

    // 재생
    audioRef.current.play().catch(console.error);
  }, [isPlaying]);

  // 볼륨 변경
  useEffect(() => {
    // 얼리 리턴 - 오디오 객체가 없으면 종료
    if (!audioRef.current) return;

    audioRef.current.volume = volume / 100;
  }, [volume]);

  return null;
};

export default WhiteNoiseAudioManager;
