import { useEffect, useMemo } from 'react';
import { useStopwatchStore } from '../model/useStopwatchStore';

const MS = 1000;

export const StopwatchController = () => {
  const {
    isRunning,
    curStudyTime,
    todayTotalTime,
    start,
    pause,
    updateTimes,
    syncWithServer,
    apiError,
  } = useStopwatchStore();

  useEffect(() => {
    if (!isRunning) return;
    let timer: NodeJS.Timeout | null = null;

    timer = setInterval(() => {
      updateTimes();
    }, MS);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, updateTimes]);

  // 1분마다 서버와 동기화
  useEffect(() => {
    if (!isRunning) return;

    const syncInterval = setInterval(() => {
      syncWithServer();
    }, 60 * MS); // 1분

    return () => clearInterval(syncInterval);
  }, [isRunning, syncWithServer]);

  const formatTime = useMemo(() => {
    return (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
  }, []);

  // 언마운트 시 스톱워치 정지
  useEffect(() => {
    return () => {
      if (isRunning) {
        pause();
      }
    };
  }, [isRunning, pause]);

  const handleStartPause = async () => {
    if (isRunning) {
      await pause();
    } else {
      await start();
    }
  };

  return (
    <div className="bg-black text-gray-400 p-4 rounded-lg w-full max-w-xl mx-auto">
      {apiError && (
        <div className="mb-2 p-2 bg-red-900 text-red-200 rounded text-sm">
          {apiError}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="ml-4">
          <button
            onClick={handleStartPause}
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
          <div className="text-2xl">{formatTime(0)}</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-xl">오늘 총 공부 시간</div>
          <div className="text-2xl">{formatTime(todayTotalTime)}</div>
        </div>
      </div>
    </div>
  );
};
