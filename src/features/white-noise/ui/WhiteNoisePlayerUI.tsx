import { useWhiteNoiseStore } from '../model/useWhiteNoiseStore';
import { getNoiseName } from '../config/noiseConfig';
import { Play, Pause } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Label } from '@/shared/ui/label';

// 노이즈 선택과 재생/일시정지 UI만 담당
const WhiteNoisePlayerUI = () => {
  const { currentNoise, noiseList, isPlaying, setCurrentNoise, setIsPlaying } =
    useWhiteNoiseStore();

  return (
    <div className="space-y-4">
      {/* 노이즈 선택 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">노이즈 목록</Label>
        <Select
          value={currentNoise || ''}
          onValueChange={(value: string) => setCurrentNoise(value || null)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="노이즈 선택" />
          </SelectTrigger>
          <SelectContent>
            {noiseList.map((noise) => (
              <SelectItem key={noise} value={noise}>
                {getNoiseName(noise)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 재생/일시정지 버튼 - 얼리 리턴 */}
      {!currentNoise && null}
      {currentNoise && (
        <div className="flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              isPlaying
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                일시정지
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                재생
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default WhiteNoisePlayerUI;
