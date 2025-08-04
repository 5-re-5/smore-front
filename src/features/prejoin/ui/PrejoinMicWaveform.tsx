import { Grip, Mic } from 'lucide-react';
import { useMediaStreamAnalyser } from '../model/useMediaStreamAnalyser';

interface PrejoinMicWaveformProps {
  stream: MediaStream | null;
  dotCount?: number;
}

export const PrejoinMicWaveform = ({
  stream,
  dotCount = 18,
}: PrejoinMicWaveformProps) => {
  const { level } = useMediaStreamAnalyser(stream);
  const activeDots = Math.min(
    Math.max(Math.round(level * dotCount), 0),
    dotCount,
  );

  return (
    <div className="flex flex-col items-center justify-between h-100 py-4">
      <div className="flex flex-col-reverse items-center flex-1 justify-start">
        {Array.from({ length: dotCount }, (_, i) => (
          <Grip
            key={i}
            size={18}
            className={`transition-all duration-100 ${
              i < activeDots ? 'text-green-400' : 'text-gray-600'
            }`}
          />
        ))}
      </div>
      <Mic color="white" size={20} className="mt-2" />
    </div>
  );
};
