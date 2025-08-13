import {
  LocalVideoTile,
  VideoTile,
  useRemoteParticipantTracks,
} from '@/features/participants';

function VideoGrid() {
  const remoteParticipantTracks = useRemoteParticipantTracks();

  // 전체 참가자 수 계산
  const totalParticipants = 1 + remoteParticipantTracks.length;

  // 7명 이상일 때는 기존 그리드 시스템 사용
  if (totalParticipants > 6) {
    const getGridCols = (count: number) => {
      if (count <= 9) return 'grid-cols-3';
      return 'grid-cols-4';
    };

    return (
      <div
        className={`grid gap-1 place-content-center p-4 h-full ${getGridCols(totalParticipants)} auto-rows-max-content`}
      >
        <div className="aspect-video">
          <LocalVideoTile />
        </div>
        {remoteParticipantTracks.map((pt) => (
          <div
            key={pt.track?.sid || pt.participant.identity}
            className="aspect-video"
          >
            <VideoTile participant={pt.participant} track={pt.track} />
          </div>
        ))}
      </div>
    );
  }

  // 6명 이하일 때는 동적 레이아웃 시스템
  const getLayoutConfig = (participantCount: number) => {
    if (participantCount <= 2) {
      // 1-2명: 가로 일렬 - 고정 크기
      return {
        containerClass:
          'h-full flex flex-row justify-center items-center gap-10 p-4',
        videoClass: 'w-[40rem] h-[24rem] flex-shrink-0',
        maxWidth: '',
        maxHeight: '',
      };
    }
    if (participantCount <= 4) {
      // 3-4명: 2x2 그리드
      return {
        containerClass:
          'h-full max-w-4xl mx-auto grid grid-cols-2 gap-2 justify-center content-center place-items-center',
        videoClass: 'w-full aspect-video',
        maxWidth: 'max-w-[29vw]',
        maxHeight: 'max-h-[35vh]',
      };
    }
    // 5-6명: 2x3 그리드
    return {
      containerClass:
        'h-full grid grid-cols-3 gap-1 p-4 place-content-center place-items-center',
      videoClass: 'w-full aspect-video',
      maxWidth: 'max-w-[25vw]',
      maxHeight: 'max-h-[25vh]',
    };
  };

  const layout = getLayoutConfig(totalParticipants);

  // 모든 참가자 컴포넌트 배열 생성
  const allParticipants = [
    <div
      key="local"
      className={`${layout.videoClass} ${layout.maxWidth} ${layout.maxHeight}`}
    >
      <LocalVideoTile />
    </div>,
    ...remoteParticipantTracks.map((pt) => (
      <div
        key={pt.track?.sid || pt.participant.identity}
        className={`${layout.videoClass} ${layout.maxWidth} ${layout.maxHeight}`}
      >
        <VideoTile participant={pt.participant} track={pt.track} />
      </div>
    )),
  ];

  return <div className={layout.containerClass}>{allParticipants}</div>;
}

export default VideoGrid;
