import { useState, useEffect } from 'react';
import { fetchWeeklyAvgBarChart } from '../api/WeeklyAvgBarChartApi';
import type { WeeklyAvgBarChartApiResponse } from '../types/WeeklyAvgBarChartTypes';

// 목데이터 (API 호출 실패 시 fallback)
const mockWeeklyGraph = [6.5, 8, 9.5, 7, 8.5];

export function useWeeklyAvgBarChart(userId: string) {
  const [weeklyGraph, setWeeklyGraph] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchWeeklyAvgBarChart(userId)
      .then((data: WeeklyAvgBarChartApiResponse) => {
        // ✅ 타입 적용 → data 형식 보장
        setWeeklyGraph(data.data.weekly_graph);
      })
      .catch((e: Error) => {
        setError(e.message || '네트워크 오류');
        setWeeklyGraph(mockWeeklyGraph);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { weeklyGraph, loading, error };
}
