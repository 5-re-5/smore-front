import {
  LocalVideoTile,
  VideoTile,
  useRemoteParticipantTracks,
} from '@/features/participants';

function VideoGrid() {
  const remoteParticipantTracks = useRemoteParticipantTracks();

  // 전체 참가자 수 계산
  const totalParticipants = 1 + remoteParticipantTracks.length;

  // 참가자 수에 따른 그리드 컬럼 결정
  const getGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-3';
    return 'grid-cols-3';
  };

  return (
    <div className={`grid ${getGridCols(totalParticipants)} gap-4 p-4`}>
      {/* 로컬 참가자 (항상 첫 번째) */}
      <LocalVideoTile />

      {/* 리모트 참가자들 */}
      {remoteParticipantTracks.map((pt) => (
        <VideoTile
          key={pt.track.sid}
          participant={pt.participant}
          track={pt.track}
        />
      ))}
    </div>
  );
}

export default VideoGrid;
