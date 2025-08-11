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
    <div className="bg-white rounded-lg border">
      {/* Host Controls */}
      <div className="flex gap-1 mb-2">
        <button
          onClick={() => usePomodoroStore.getState().setHost(true)}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
        >
          방장
        </button>
        <button
          onClick={() => usePomodoroStore.getState().setHost(false)}
          className="px-2 py-1 bg-gray-500 text-white rounded text-xs"
        >
          참가자
        </button>
      </div>
      {isHost ? <PomodoroController /> : <PomodoroViewer />}
    </div>
  );
}

export default PomodoroSection;
