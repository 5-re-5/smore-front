import type { ApiResponse } from '../types/MonthlyLineChartTypes';

export async function fetchMonthlyStudyStatistics(
  userId: string,
): Promise<ApiResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_BACK_URL}/v1/study-times/statistics/${userId}`,
  );
  if (!res.ok) throw new Error('API 요청 실패');
  return res.json();
}
