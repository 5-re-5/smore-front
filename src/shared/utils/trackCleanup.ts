import type { Room } from 'livekit-client';

/**
 * 방을 나갈 때 local tracks를 안전하게 정리하는 유틸리티 함수
 * 카메라, 마이크, 스크린 공유를 모두 끄고 정리합니다.
 *
 * @param room - LiveKit Room 인스턴스
 */
export const cleanupLocalTracks = async (room: Room) => {
  try {
    const localParticipant = room.localParticipant;

    // 1. 카메라, 마이크, 스크린 공유 비활성화
    await Promise.all([
      localParticipant.setCameraEnabled(false),
      localParticipant.setMicrophoneEnabled(false),
      localParticipant.setScreenShareEnabled(false),
    ]);

    // 2. 모든 local tracks를 명시적으로 unpublish
    const trackPublications = [
      ...localParticipant.videoTrackPublications.values(),
      ...localParticipant.audioTrackPublications.values(),
    ];

    for (const publication of trackPublications) {
      if (publication.track) {
        // track detach (HTML 요소에서 제거)
        publication.track.detach();

        // MediaStreamTrack 직접 stop (브라우저 레벨에서 확실한 정리)
        const mediaStreamTrack = publication.track.mediaStreamTrack;
        if (mediaStreamTrack && mediaStreamTrack.readyState !== 'ended') {
          mediaStreamTrack.stop();
        }

        // track unpublish
        localParticipant.unpublishTrack(publication.track);
      }
    }

    // 3. 추가: 모든 MediaStream tracks 직접 정리 (보험용)
    const allPublications = [
      ...Array.from(localParticipant.videoTrackPublications.values()),
      ...Array.from(localParticipant.audioTrackPublications.values()),
    ];

    for (const publication of allPublications) {
      const mediaStreamTrack = publication.track?.mediaStreamTrack;
      if (mediaStreamTrack && mediaStreamTrack.readyState !== 'ended') {
        mediaStreamTrack.stop();
      }
    }
  } catch (error) {
    // 이미 정리되었거나 연결이 끊어진 경우 무시
    console.warn('Track 정리 중 오류:', error);
  }
};

/**
 * 전역으로 실행 중인 모든 MediaStream tracks를 정리하는 함수
 * 페이지 이동이나 브라우저 종료 시 사용
 */
export const cleanupAllMediaTracks = () => {
  try {
    // navigator.mediaDevices.getUserMedia로 생성된 모든 스트림은
    // 브라우저가 내부적으로 관리하므로 직접 접근은 어렵지만,
    // document의 모든 video/audio 요소에서 srcObject 정리
    const mediaElements = document.querySelectorAll('video, audio');

    mediaElements.forEach((element) => {
      const mediaElement = element as HTMLVideoElement | HTMLAudioElement;
      if (mediaElement.srcObject) {
        const stream = mediaElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
          if (track.readyState !== 'ended') {
            track.stop();
          }
        });
        mediaElement.srcObject = null;
      }
    });
  } catch (error) {
    console.warn('전체 MediaTrack 정리 중 오류:', error);
  }
};
