import { useEffect, useMemo } from 'react';
import { useStopwatchStore } from '../model/useStopwatchStore';

const MS = 1000;

export const StopwatchController = () => {
  const {
    isRunning,
    todayTotalTime,
    serverTodayStudyTime,
    serverTargetStudyTime,
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
    <div className="bg-black text-gray-400 p-3 rounded-lg w-100">
      {apiError && (
        <div className="mb-2 p-2 bg-red-900 text-red-200 rounded text-xs">
          {apiError}
        </div>
      )}
      <div className="flex items-center justify-between gap-1">
        <button
          onClick={handleStartPause}
          className="bg-gray-600 px-3 py-1 rounded-md text-white text-sm"
        >
          {isRunning ? '정지' : '시작'}
        </button>
        <div className="flex-1 text-center">
          <div className="text-sm">오늘 공부 시간</div>
          <div className="text-lg font-mono">
            {formatTime(serverTodayStudyTime + todayTotalTime)}
          </div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-sm">목표 시간</div>
          <div className="text-lg font-mono">
            {formatTime(serverTargetStudyTime)}
          </div>
        </div>
      </div>
    </div>
  );
};
