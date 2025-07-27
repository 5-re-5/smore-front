import { useParticipants } from '@livekit/components-react';

export function useRemoteParticipantTracks() {
  const participants = useParticipants();

  return participants
    .filter((p) => !p.isLocal)
    .flatMap((participant) =>
      participant
        .getTrackPublications()
        .filter((pub) => pub.track !== undefined && pub.kind === 'video')
        .map((pub) => ({
          track: pub.track!,
          identity: participant.identity,
          isLocal: false,
          isSpeaking: participant.isSpeaking,
        })),
    );
}
