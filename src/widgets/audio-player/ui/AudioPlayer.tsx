import { useAttachAudioTrack } from '../model/useAttachAudioTrack';
import type { AudioPlayerProps } from '../types';

export default function AudioPlayer({ track }: AudioPlayerProps) {
  const audioRef = useAttachAudioTrack({ track });
  return <audio ref={audioRef} id={track.sid} />;
}
