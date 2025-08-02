import {
  PomodoroController,
  PomodoroViewer,
  usePomodoroStore,
  usePomodoroSync,
} from '@/features/pomodoro';

function PomodoroSection() {
  const { isHost } = usePomodoroStore();
  usePomodoroSync(); // Initialize sync

  return (
    <div>
      {/* Host Controls */}
      <div>
        <button
          onClick={() => usePomodoroStore.getState().setHost(true)}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm mr-2"
        >
          방장 모드
        </button>
        <button
          onClick={() => usePomodoroStore.getState().setHost(false)}
          className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
        >
          참가자 모드
        </button>
      </div>
      뽀모도로 타이머
      {isHost ? <PomodoroController /> : <PomodoroViewer />}
    </div>
  );
}

export default PomodoroSection;
