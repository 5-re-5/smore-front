import {
  PomodoroController,
  PomodoroViewer,
  usePomodoroStore,
  usePomodoroSync,
} from '@/features/pomodoro';

function PomodoroSection() {
  const { isOwner } = usePomodoroStore();
  usePomodoroSync(); // Initialize sync

  return (
    <div className="bg-white rounded-lg border">
      {isOwner ? <PomodoroController /> : <PomodoroViewer />}
    </div>
  );
}

export default PomodoroSection;
