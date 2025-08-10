import { Participant, Track } from 'livekit-client';
import { useRef } from 'react';
import { useAttachVideoTrack } from '../model/useAttachVideoTrack';
import { TrackMutedIndicator } from '@livekit/components-react';

interface VideoTileProps {
  participant: Participant;
  track: Track;
}

function VideoTile({ participant, track }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useAttachVideoTrack(videoRef, track);

  const micPub = participant.getTrackPublication(Track.Source.Microphone);
  const camPub = participant.getTrackPublication(Track.Source.Camera);

  const isMicMuted = micPub?.isMuted ?? true;
  const isCamMuted = camPub?.isMuted ?? true;

  const voiceTrackRef = {
    participant,
    source: Track.Source.Microphone,
  };
  const videoTrackRef = {
    participant,
    source: Track.Source.Camera,
  };

  return (
    <div
      className={`w-80 h-60 relative rounded-xl border transition-all duration-300 ${
        participant.isSpeaking
          ? 'border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'
          : 'border-zinc-300'
      }`}
    >
      {isCamMuted ? (
        <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
          <span className="text-white text-xl font-semibold">
            {participant.identity}
          </span>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted={participant.isLocal}
          playsInline
          className="w-full h-full object-cover rounded-xl"
          style={{ transform: 'scaleX(-1)' }}
        />
      )}
      <div className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
        {participant.identity}
      </div>
      <div className="absolute top-2 right-2 flex gap-2">
        {isMicMuted && (
          <TrackMutedIndicator
            trackRef={voiceTrackRef}
            className=" bg-white rounded-2xl p-1"
          />
        )}
        {isCamMuted && (
          <TrackMutedIndicator
            trackRef={videoTrackRef}
            className=" bg-white rounded-2xl p-1"
          />
        )}
      </div>
    </div>
  );
}

export default VideoTile;
