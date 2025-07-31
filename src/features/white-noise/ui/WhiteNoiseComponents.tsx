import { Music } from 'lucide-react';
import { useWhiteNoiseStore } from '../model/useWhiteNoiseStore';
import WhiteNoiseController from './WhiteNoiseController';
import WhiteNoisePlayerUI from './WhiteNoisePlayerUI';
import WhiteNoiseAudioManager from './WhiteNoiseAudioManager';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

function WhiteNoiseComponents() {
  const { currentNoise, isPlaying } = useWhiteNoiseStore();

  return (
    <div className="relative">
      {/* 백그라운드 오디오 매니저 - 항상 동작 */}
      <WhiteNoiseAudioManager />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`relative p-2 rounded-lg transition-colors ${
              currentNoise && isPlaying
                ? 'text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Music className="w-5 h-5" />
            {/* 재생 중 표시 - 아이콘 위에 */}
            {currentNoise && isPlaying && (
              <div
                className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap z-20"
                aria-label="현재 재생 중"
                role="status"
              >
                재생중
              </div>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-80 p-4 space-y-4"
          align="end"
          side="top"
          sideOffset={8}
        >
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
              화이트 노이즈 설정
            </h3>
            <WhiteNoisePlayerUI />
            <WhiteNoiseController />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default WhiteNoiseComponents;
