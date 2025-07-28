import { useEffect, useState } from 'react';
import { useStopwatchStore } from '../model/useStopwatchStore';

export const StopwatchController = () => {
  const { isRunning, sessionElapsedTime, startTime, start, pause } =
    useStopwatchStore();
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - (startTime || 0);
      setTime(elapsed);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, startTime]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="bg-black text-gray-400 p-4 rounded-lg w-full max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        {/* 현재 공부 시간 */}
        <div className="flex-1 text-center">
          <div className="text-xl">현재 공부 시간</div>
          <div className="text-2xl">{formatTime(time)}</div>
        </div>

        {/* 목표 공부 시간 */}

        <div className="flex-1 text-center">
          <div className="text-xl">목표 시간</div>
          <div className="text-2xl">{formatTime(3600000)}</div>
          {/* 예시로 1시간 설정 */}
        </div>

        {/* 오늘 총 공부 시간 */}
        <div className="flex-1 text-center">
          <div className="text-xl">오늘 총 공부 시간</div>
          <div className="text-2xl">{formatTime(sessionElapsedTime)}</div>
        </div>

        {/* 버튼 */}
        <div className="ml-4">
          <button
            onClick={isRunning ? pause : start}
            className="bg-gray-600 px-4 py-2 rounded-md text-white"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
};
