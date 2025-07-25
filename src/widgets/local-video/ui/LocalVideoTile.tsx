import useAttachLocalVideo from '../model/useAttachLocalVideo';
import type { LocalVideoTrack } from 'livekit-client';

export interface LocalVideoTileProps {
  track: LocalVideoTrack;
  participantIdentity: string;
}

function LocalVideoTile({ track, participantIdentity }: LocalVideoTileProps) {
  const videoElement = useAttachLocalVideo(track);

  return (
    <div id={'camera-' + participantIdentity} className="video-container">
      <div className="participant-data">
        <p>{participantIdentity + ' (You)'}</p>
      </div>
      <video ref={videoElement} id={track.sid}></video>
    </div>
  );
}

export default LocalVideoTile;
