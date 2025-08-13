import { Pause, Play } from 'lucide-react';
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
    <div
      className="text-gray-600 p-3 w-100"
      style={{
        borderRadius: '7.56px',
        background: isRunning ? '#E5ECF6' : '#F6E5E5',
        boxShadow:
          '0 -1.599px 1.599px 0 #D8DFE8 inset, 0 1.599px 1.599px 0 #EFF6FF inset, 0 6.048px 12.096px 0 rgba(46, 47, 49, 0.17)',
      }}
    >
      {apiError && (
        <div className="mb-2 p-2 bg-red-900 text-red-200 rounded text-xs">
          {apiError}
        </div>
      )}
      <div className="flex items-center justify-between gap-1">
        <button
          onClick={handleStartPause}
          className="px-3 py-1 text-sm flex items-center gap-1"
          style={{
            borderRadius: '5.292px',
            background: isRunning ? '#E5ECF6' : '#F6E5E5',
            boxShadow:
              '0 -1.12px 1.12px 0 #D8DFE8 inset, 0 1.12px 1.12px 0 #EFF6FF inset, 0 4.234px 8.467px 0 rgba(46, 47, 49, 0.17)',
            color: isRunning ? '#3B82F6' : '#EF4444',
          }}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? '정지' : '시작'}
        </button>
        <div className="flex-1 text-center">
          <div className="text-xs">오늘 공부 시간</div>
          <div className="text-lg font-mono">
            {formatTime(serverTodayStudyTime + todayTotalTime)}
          </div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-xs">목표 시간</div>
          <div className="text-lg font-mono">
            {formatTime(serverTargetStudyTime)}
          </div>
        </div>
      </div>
    </div>
  );
};
