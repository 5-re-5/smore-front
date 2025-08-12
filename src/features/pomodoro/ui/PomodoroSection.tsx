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
    <div className="">
      {isOwner ? <PomodoroController /> : <PomodoroViewer />}
    </div>
  );
}

export default PomodoroSection;
