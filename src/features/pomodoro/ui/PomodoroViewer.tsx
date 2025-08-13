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

  const getStatusMessage = (): string => {
    if (!isRunning) {
      return '정지';
    }
    return phase === 'study' ? '집중 중' : '휴식 중';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Outer white neumorphism container - 184.32px = 11.52rem */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: '11.52rem',
            height: '11.52rem',
            borderRadius: '9rem',
            border: '0.045rem solid #D6E3F3',
            background: '#E3EDF7',
            boxShadow: `
              0.09rem 0.09rem 0.18rem 0 rgba(114, 142, 171, 0.10),
              -0.27rem -0.27rem 0.9rem 0 #FFF,
              0.18rem 0.18rem 0.9rem 0 rgba(111, 140, 176, 0.41)
            `,
          }}
        >
          {/* Progress circle positioned absolutely */}
          <CircularProgress progress={getProgress()} />

          {/* Status display container - same size as button container */}
          <div
            className="relative flex items-center justify-center z-10"
            style={{
              width: '4.23rem',
              height: '4.23rem',
              borderRadius: '9rem',
              border: '0.045rem solid #D6E3F3',
              background: '#E3EDF7',
              // boxShadow: `
              //   0.09rem 0.09rem 0.18rem 0 rgba(114, 142, 171, 0.10),
              //   -0.27rem -0.27rem 0.9rem 0 #FFF,
              //   0.18rem 0.18rem 0.9rem 0 rgba(111, 140, 176, 0.41)
              // `
            }}
          >
            {/* Status text display - same size as actual button */}
            <div
              className="flex items-center justify-center text-xs font-medium text-gray-700"
              style={{
                width: '3.33rem',
                height: '3.33rem',
                borderRadius: '9rem',
                border: '0.045rem solid #D6E3F3',
                background: '#E3EDF7',
                boxShadow: `
                  0.09rem 0.09rem 0.18rem 0 rgba(114, 142, 171, 0.10),
                  -0.27rem -0.27rem 0.9rem 0 #FFF,
                  0.18rem 0.18rem 0.9rem 0 rgba(111, 140, 176, 0.41)
                `,
              }}
            >
              {getStatusMessage()}
            </div>
          </div>
        </div>

        {/* Time display positioned outside the circle - white text only */}
        <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2">
          <div className="text-md font-bold text-white">
            {formatTime(remainingTime)}
          </div>
        </div>
      </div>
    </div>
  );
};
