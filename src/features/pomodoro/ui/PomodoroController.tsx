import { useInterval } from '@/shared/hooks/useInterval';
import { Button } from '@/shared/ui/button';
import { usePomodoroStore } from '../model/usePomodoroStore';
import { formatTime } from '../model/utils';
import { CircularProgress } from './CircularProgress';

export const PomodoroController = () => {
  const {
    phase,
    remainingTime,
    isRunning,
    studyTimeMinutes,
    breakTimeMinutes,
    start,
    pause,
    tick,
    resetTimer,
  } = usePomodoroStore();

  useInterval(tick, isRunning ? 1000 : null);

  const getProgress = (): number => {
    const totalTime =
      phase === 'study' ? studyTimeMinutes * 60 : breakTimeMinutes * 60;
    return (remainingTime / totalTime) * 100;
  };

  const getPhaseColor = (): string => {
    return phase === 'study' ? 'text-blue-500' : 'text-green-500';
  };

  return (
    <div className="flex flex-col items-center space-y-2 p-1 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-sm font-semibold">뽀모도로 타이머</h2>
        <div className={`text-sm font-medium ${getPhaseColor()}`}>
          {phase === 'study' ? '집중 시간' : '휴식 시간'}
        </div>
      </div>

      <div className="relative">
        <CircularProgress
          progress={getProgress()}
          size={100}
          strokeWidth={20}
          className={getPhaseColor()}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-800">
              {formatTime(remainingTime)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={isRunning ? pause : start}
          variant={isRunning ? 'secondary' : 'default'}
          size="sm"
        >
          {isRunning ? '일시정지' : '시작'}
        </Button>

        <Button onClick={resetTimer} variant="outline" size="sm">
          초기화
        </Button>
      </div>
    </div>
  );
};
