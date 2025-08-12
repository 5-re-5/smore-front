import { usePomodoroStore } from '../model/usePomodoroStore';
import { formatTime } from '../model/utils';
import { CircularProgress } from './CircularProgress';

export const PomodoroViewer = () => {
  const {
    phase,
    remainingTime,
    isRunning,
    studyTimeMinutes,
    breakTimeMinutes,
  } = usePomodoroStore();

  const getProgress = (): number => {
    const totalTime =
      phase === 'study' ? studyTimeMinutes * 60 : breakTimeMinutes * 60;
    return (remainingTime / totalTime) * 100;
  };

  const getPhaseColor = (): string => {
    return phase === 'study' ? 'text-blue-500' : 'text-green-500';
  };

  const getStatusMessage = (): string => {
    if (!isRunning) {
      return '정지';
    }
    return phase === 'study' ? '집중 중' : '휴식 중';
  };

  return (
    <div className="flex flex-col items-center space-y-2 p-1 bg-grey-50 rounded-lg ">
      <div className="relative">
        <CircularProgress
          progress={getProgress()}
          size={100}
          strokeWidth={20}
          className={getPhaseColor()}
        />
        <div
          className={` absolute inset-0 flex items-center justify-center text-sm font-medium ${isRunning ? getPhaseColor() : 'text-gray-500'}`}
        >
          {getStatusMessage()}
        </div>
        <div className="absolute bottom-0.5 left-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-bold text-white">
              {formatTime(remainingTime)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
