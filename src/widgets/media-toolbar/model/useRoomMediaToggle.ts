import { useState, useCallback, useRef } from 'react';
import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { Track } from 'livekit-client';
import {
  loadMediaSettings,
  saveMediaSettings,
} from '@/shared/utils/mediaSettings';
import { useAuth } from '@/entities/user';
import { useMediaSync } from '@/shared/hooks/useMediaSync';
import { useParams } from '@tanstack/react-router';

type MediaType = 'microphone' | 'camera' | 'speaker';

interface UseRoomMediaToggleProps {
  mediaType: MediaType;
  onError?: (error: Error) => void;
}

interface RoomMediaToggleState {
  isEnabled: boolean;
  isPending: boolean;
  error: Error | null;
  toggle: () => Promise<void>;
}

export const useRoomMediaToggle = ({
  mediaType,
  onError,
}: UseRoomMediaToggleProps): RoomMediaToggleState => {
  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();
  const { userId } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(() => {
    const savedSettings = loadMediaSettings();
    return !savedSettings.speaker;
  });

  // roomId 가져오기 (URL 파라미터에서)
  const { roomId } = useParams({ from: '/room/$roomId' });
  const roomIdNumber = parseInt(roomId, 10);

  // 미디어 동기화 훅 (마이크/카메라용)
  const { updateMediaSettings } = useMediaSync({
    roomId: roomIdNumber,
    userId: userId || 0,
    onError: (err) => {
      console.error('미디어 설정 서버 동기화 실패:', err);
    },
  });

  // updateMediaSettings ref로 최신 함수 참조
  const updateMediaSettingsRef = useRef(updateMediaSettings);
  updateMediaSettingsRef.current = updateMediaSettings;

  // LiveKit에서 현재 상태 가져오기
  const isEnabled = (() => {
    if (!localParticipant) return false;

    switch (mediaType) {
      case 'microphone': {
        // 트랙이 발행되어 있는지 확인
        const micPublication = localParticipant.getTrackPublication(
          Track.Source.Microphone,
        );
        return !!micPublication && !micPublication.isMuted;
      }
      case 'camera': {
        // 트랙이 발행되어 있는지 확인
        const cameraPublication = localParticipant.getTrackPublication(
          Track.Source.Camera,
        );
        return !!cameraPublication && !cameraPublication.isMuted;
      }
      case 'speaker':
        // 스피커는 로컬 상태로 관리
        return !isSpeakerMuted;
      default:
        return false;
    }
  })();

  const toggle = useCallback(async () => {
    if (!localParticipant || isPending) return;

    setIsPending(true);
    setError(null);

    try {
      switch (mediaType) {
        case 'microphone': {
          if (isEnabled) {
            // 마이크 끄기 - 트랙을 완전히 unpublish
            const micPublication = localParticipant.getTrackPublication(
              Track.Source.Microphone,
            );
            if (micPublication) {
              await localParticipant.unpublishTrack(micPublication.track!);
            }
          } else {
            // 마이크 켜기 - 새 트랙 생성하여 publish
            await localParticipant.setMicrophoneEnabled(true);
          }

          // localStorage에 마이크 설정 저장
          const currentSettings = loadMediaSettings();
          const newSettings = {
            ...currentSettings,
            audio: !isEnabled, // 토글된 상태로 저장
          };
          saveMediaSettings(newSettings);

          // 서버에 미디어 설정 동기화 (디바운스)
          updateMediaSettingsRef.current({
            audioEnabled: !isEnabled,
            videoEnabled: newSettings.video,
          });
          break;
        }
        case 'camera': {
          if (isEnabled) {
            // 카메라 끄기 - 트랙을 완전히 unpublish
            const cameraPublication = localParticipant.getTrackPublication(
              Track.Source.Camera,
            );
            if (cameraPublication) {
              await localParticipant.unpublishTrack(cameraPublication.track!);
            }
          } else {
            // 카메라 켜기 - 새 트랙 생성하여 publish
            await localParticipant.setCameraEnabled(true);
          }

          // localStorage에 카메라 설정 저장
          const currentSettings = loadMediaSettings();
          const newSettings = {
            ...currentSettings,
            video: !isEnabled, // 토글된 상태로 저장
          };
          saveMediaSettings(newSettings);

          // 서버에 미디어 설정 동기화 (디바운스)
          updateMediaSettingsRef.current({
            audioEnabled: newSettings.audio,
            videoEnabled: !isEnabled,
          });
          break;
        }
        case 'speaker': {
          // 룸의 모든 오디오 트랙을 음소거/음소거 해제
          const newMutedState = !isSpeakerMuted;
          setIsSpeakerMuted(newMutedState);

          // localStorage에 스피커 설정 저장
          const currentSettings = loadMediaSettings();
          saveMediaSettings({
            ...currentSettings,
            speaker: !newMutedState, // muted가 false면 speaker enabled = true
          });

          // Custom Event 발송하여 RoomPage에 변경 알림
          window.dispatchEvent(new CustomEvent('speakerToggle'));

          if (room) {
            // 모든 원격 참가자의 오디오 트랙 음소거 제어
            room.remoteParticipants.forEach((participant) => {
              participant.audioTrackPublications.forEach((publication) => {
                if (publication.track?.mediaStreamTrack) {
                  publication.track.mediaStreamTrack.enabled = !newMutedState;
                }
              });
            });
          }
          break;
        }
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      onError?.(error);
    } finally {
      setIsPending(false);
    }
  }, [
    localParticipant,
    room,
    mediaType,
    isEnabled,
    isPending,
    isSpeakerMuted,
    onError,
    // updateMediaSettings 제거 - ref로 참조하므로 의존성 불필요
  ]);

  return {
    isEnabled,
    isPending,
    error,
    toggle,
  };
};
