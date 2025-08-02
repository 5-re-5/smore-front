import { useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import {
  usePomodoroStore,
  STUDY_TIME,
  BREAK_TIME,
} from '../model/usePomodoroStore';
import { CircularProgress } from './CircularProgress';

export const PomodoroController = () => {
  const {
    phase,
    remainingTime,
    isRunning,
    totalCycles,
    start,
    pause,
    tick,
    resetTimer,
  } = usePomodoroStore();

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    const totalTime = phase === 'study' ? STUDY_TIME : BREAK_TIME;
    return (remainingTime / totalTime) * 100;
  };

  const getPhaseColor = (): string => {
    return phase === 'study' ? 'text-blue-500' : 'text-green-500';
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

      <div className="flex space-x-3">
        <Button
          onClick={isRunning ? pause : start}
          variant={isRunning ? 'secondary' : 'default'}
          size="lg"
        >
          {isRunning ? '일시정지' : '시작'}
        </Button>

        <Button onClick={resetTimer} variant="outline" size="lg">
          초기화
        </Button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        방장 전용 컨트롤러
      </div>
    </div>
  );
};
