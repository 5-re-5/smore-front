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
        className={`h-full grid ${getGridCols(totalParticipants)} gap-2 p-4 auto-rows-fr`}
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

  // 6명 이하일 때는 고정 자리 시스템
  const renderFixedPositions = () => {
    const positions = [
      {
        id: 1,
        component: (
          <div key="local" className="w-[424px] h-[236px]">
            <LocalVideoTile />
          </div>
        ),
      }, // 항상 1번 자리
      ...remoteParticipantTracks.slice(0, 5).map((pt, index) => ({
        id: index + 2,
        component: (
          <div
            key={pt.track?.sid || pt.participant.identity}
            className="w-[424px] h-[236px]"
          >
            <VideoTile participant={pt.participant} track={pt.track} />
          </div>
        ),
      })),
    ];

    // 빈 자리 채우기 (6자리까지)
    while (positions.length < 6) {
      positions.push({
        id: positions.length + 1,
        component: (
          <div
            key={`empty-${positions.length + 1}`}
            className="w-[424px] h-[236px]"
          />
        ),
      });
    }

    return positions;
  };

  const positions = renderFixedPositions();

  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 p-4">
      {/* 첫 번째 줄: 1, 2, 3번 자리 */}
      <div className="flex gap-4">
        {positions.slice(0, 3).map((pos) => pos.component)}
      </div>

      {/* 두 번째 줄: 4, 5, 6번 자리 */}
      <div className="flex gap-4">
        {positions.slice(3, 6).map((pos) => pos.component)}
      </div>
    </div>
  );
}

export default VideoGrid;
