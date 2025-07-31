import { useWhiteNoiseStore } from '../model/useWhiteNoiseStore';
import { Slider } from '@/shared/ui/slider';
import { Label } from '@/shared/ui/label';

const WhiteNoiseController = () => {
  const { volume, setVolume } = useWhiteNoiseStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">볼륨</Label>
        <span className="text-sm text-gray-500">{volume}%</span>
      </div>
      <Slider
        value={[volume]}
        onValueChange={(value: number[]) => setVolume(value[0])}
        max={100}
        min={0}
        step={1}
        className="w-full"
      />
    </div>
  );
};

export default WhiteNoiseController;
