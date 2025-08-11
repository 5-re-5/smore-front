import { LocalVideoTile, RemoteVideoTiles } from '@/features/participants';

function VideoGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <LocalVideoTile />
      <RemoteVideoTiles />
    </div>
  );
}

export default VideoGrid;
