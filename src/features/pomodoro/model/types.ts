export interface PomodoroSyncData {
  type: 'pomodoro-update';
  phase: 'study' | 'break';
  remainingTime: number;
  isRunning: boolean;
  totalCycles: number;
  timestamp: number;
}
