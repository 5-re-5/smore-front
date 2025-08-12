import { useParticipants } from '@livekit/components-react';
export function useRemoteParticipantTracks() {
  const participants = useParticipants();

  return participants
    .filter((p) => !p.isLocal)
    .map((participant) => {
      const videoPublication = participant
        .getTrackPublications()
        .find((pub) => pub.kind === 'video');

      return {
        participant,
        track: videoPublication?.track || null,
      };
    });
}
