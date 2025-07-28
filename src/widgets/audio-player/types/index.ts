import { LocalAudioTrack, RemoteAudioTrack } from 'livekit-client';

export interface AudioPlayerProps {
  track: LocalAudioTrack | RemoteAudioTrack;
}
