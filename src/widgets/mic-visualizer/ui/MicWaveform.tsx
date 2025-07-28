import { LocalAudioTrack } from 'livekit-client';
import { useMicAnalyser } from '@/entities/track/model/useMicAnalyser';

interface Props {
  track?: LocalAudioTrack;
  dotCount?: number;
}

export default function MicWaveform({ track, dotCount = 8 }: Props) {
  const { level } = useMicAnalyser(track);
  const activeDots = Math.round(level * dotCount);

  return (
    <div className="flex flex-col-reverse items-center gap-1 h-24 justify-end">
      {Array.from({ length: dotCount }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-100 ${
            i < activeDots ? 'bg-green-500' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
}
