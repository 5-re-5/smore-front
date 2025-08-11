import type { WeeklyAvgBarChartApiResponse } from '../types/WeeklyAvgBarChartTypes';

export async function fetchWeeklyAvgBarChart(
  userId: string,
): Promise<WeeklyAvgBarChartApiResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_BACK_URL}/api/v1/study-times/statistics/${userId}`,
  );
  if (!res.ok) throw new Error(`API 에러: ${res.status}`);
  return res.json();
}
