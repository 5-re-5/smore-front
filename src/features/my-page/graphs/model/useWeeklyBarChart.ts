import { useState, useEffect } from 'react';
import { fetchWeeklyBarChart } from '../api/WeeklyBarChartApi';
import type { WeeklyBarChartApiResponse } from '../types/WeeklyBarChartTypes';

// 목데이터(에러/네트워크 장애 시 fallback)
const mockWeekdayGraph = [6, 4, 2, 12, 4, 0, 3];

export function useWeeklyBarChart(userId: string) {
  const [weekdayGraph, setWeekdayGraph] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchWeeklyBarChart(userId)
      // ✅ 여기서 WeeklyBarChartApiResponse 타입을 사용
      .then((res: WeeklyBarChartApiResponse) => {
        setWeekdayGraph(res.data.weekday_graph);
      })
      .catch((e: Error) => {
        setError(e.message ?? '네트워크 오류');
        setWeekdayGraph(mockWeekdayGraph);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { weekdayGraph, loading, error };
}
