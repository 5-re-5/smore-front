import { useRemoteParticipantTracks } from '../model/useRemoteParticipantTracks';
import VideoTile from './VideoTile';

export function RemoteVideoTiles() {
  const participantTracks = useRemoteParticipantTracks();

  return (
    <>
      {participantTracks.map((pt) => (
        <VideoTile
          key={pt.track.sid}
          participant={pt.participant}
          track={pt.track}
        />
      ))}
    </>
  );
}
