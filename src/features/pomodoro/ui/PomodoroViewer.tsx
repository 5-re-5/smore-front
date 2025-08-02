import { usePomodoroStore } from '../model/usePomodoroStore';
import { CircularProgress } from './CircularProgress';

export const PomodoroViewer = () => {
  const { phase, remainingTime, isRunning, totalCycles } = usePomodoroStore();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    const totalTime = phase === 'study' ? 25 * 60 : 5 * 60;
    return (remainingTime / totalTime) * 100;
  };

  const getPhaseColor = (): string => {
    return phase === 'study' ? 'text-blue-500' : 'text-green-500';
  };

  const getStatusMessage = (): string => {
    if (!isRunning) {
      return '일시정지됨';
    }
    return phase === 'study' ? '집중 중...' : '휴식 중...';
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">뽀모도로 타이머</h2>
        <div className={`text-lg font-medium ${getPhaseColor()}`}>
          {phase === 'study' ? '집중 시간' : '휴식 시간'}
        </div>
      </div>

      <div className="relative">
        <CircularProgress
          progress={getProgress()}
          size={200}
          strokeWidth={12}
          className={getPhaseColor()}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {formatTime(remainingTime)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              사이클: {totalCycles}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div
          className={`text-sm font-medium ${isRunning ? getPhaseColor() : 'text-gray-500'}`}
        >
          {getStatusMessage()}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          방장이 타이머를 제어합니다
        </div>
      </div>
    </div>
  );
};
