import { useLocalTracks } from '@/entities/track/model/useLocalTracks';
import LocalVideoTile from '@/widgets/local-video/ui/LocalVideoTile';
import MicWaveform from '@/widgets/mic-visualizer/ui/MicWaveform';
import { useState } from 'react';

function Roompage() {
  const { videoTrack, audioTrack } = useLocalTracks();
  // 유저 구분하기 위한 값
  const [participantName, setParticipantName] = useState(
    'Participant' + Math.floor(Math.random() * 100),
  );

  return (
    <>
      <button
        onClick={() =>
          setParticipantName('Participant' + Math.floor(Math.random() * 100))
        }
      >
        버튼
      </button>
      {videoTrack ? (
        <>
          <LocalVideoTile
            track={videoTrack}
            participantIdentity={participantName}
          />
          <MicWaveform track={audioTrack} />
        </>
      ) : (
        <div>카메라 로딩중</div>
      )}
    </>
  );
}

export default Roompage;
