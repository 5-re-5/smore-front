import { useInterval } from '@/shared/hooks/useInterval';
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
  } = usePomodoroStore();

  useInterval(tick, isRunning ? 1000 : null);

  const getProgress = (): number => {
    const totalTime =
      phase === 'study' ? studyTimeMinutes * 60 : breakTimeMinutes * 60;
    return (remainingTime / totalTime) * 100;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Outer white neumorphism container - 147.456px = 9.216rem */}
        <div
          className="flex relative justify-center items-center"
          style={{
            width: '9.216rem',
            height: '9.216rem',
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

          {/* Button outer container - 54.144px = 3.384rem */}
          <div
            className="flex relative z-10 justify-center items-center"
            style={{
              width: '3.384rem',
              height: '3.384rem',
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
            {/* Actual button - 42.624px = 2.664rem */}
            <button
              onClick={isRunning ? pause : start}
              className="flex justify-center items-center text-xs font-medium text-gray-700 transition-all duration-150 active:scale-95"
              style={{
                width: '2.664rem',
                height: '2.664rem',
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
              {isRunning ? '정지' : '시작'}
            </button>
          </div>
        </div>

        {/* Time display positioned outside the circle - white text only */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
          <div className="font-bold text-white text-md">
            {formatTime(remainingTime)}
          </div>
        </div>
      </div>
    </div>
  );
};
