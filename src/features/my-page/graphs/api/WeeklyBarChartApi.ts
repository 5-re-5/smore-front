import type { WeeklyBarChartApiResponse } from '../types/WeeklyBarChartTypes';

export async function fetchWeeklyBarChart(
  userId: string,
): Promise<WeeklyBarChartApiResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_BACK_URL}/api/v1/study-times/statistics/${userId}`,
  );
  if (!res.ok) throw new Error(`API 실패: ${res.status}`);
  return res.json();
}
