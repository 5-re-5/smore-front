import { useEffect, useMemo } from 'react';
import { useStopwatchStore } from '../model/useStopwatchStore';

export const StopwatchController = () => {
  const { isRunning, curStudyTime, todayTotalTime, start, pause, updateTimes } =
    useStopwatchStore();

  const MS = 1000;

  useEffect(() => {
    if (!isRunning) return;
    let timer: NodeJS.Timeout | null = null;

    timer = setInterval(() => {
      updateTimes();
    }, MS);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  const formatTime = useMemo(() => {
    return (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
  }, []);

  return (
    <div className="bg-black text-gray-400 p-4 rounded-lg w-full max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="ml-4">
          <button
            onClick={isRunning ? pause : start}
            className="bg-gray-600 px-4 py-2 rounded-md text-white"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
        </div>
        <div className="flex-1 text-center">
          <div className="text-xl">현재 공부 시간</div>
          <div className="text-2xl">{formatTime(curStudyTime)}</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-xl">목표 시간</div>
          <div className="text-2xl">{formatTime(3600)}</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-xl">오늘 총 공부 시간</div>
          <div className="text-2xl">{formatTime(todayTotalTime)}</div>
        </div>
      </div>
    </div>
  );
};
