import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function minutesToTimeString(minutes: number): string {
  const roundedMinutes = Math.round(minutes * 100) / 100;
  const hours = Math.floor(roundedMinutes / 60);
  const mins = Math.round(roundedMinutes % 60);

  if (hours === 0) {
    return `${mins}분`;
  }
  return `${hours}시간 ${mins}분`;
}

export function calculateDDay(targetDate: string): string {
  const today = new Date();
  const target = new Date(targetDate);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'D-DAY';
  } else if (diffDays > 0) {
    return `D-${diffDays}`;
  } else {
    return `D+${Math.abs(diffDays)}`;
  }
}
