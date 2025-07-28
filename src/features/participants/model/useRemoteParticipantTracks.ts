import { useParticipants } from '@livekit/components-react';
export function useRemoteParticipantTracks() {
  const participants = useParticipants();

  return participants
    .filter((p) => !p.isLocal)
    .flatMap((participant) =>
      participant
        .getTrackPublications()
        .filter((pub) => pub.track !== undefined && pub.kind === 'video')
        .map((pub) => {
          if (!pub.track) return null;
          return {
            participant,
            track: pub.track,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null),
    );
}
