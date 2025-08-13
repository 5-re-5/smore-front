import { useState, useEffect } from 'react';
import { fetchWeeklyAvgBarChart } from '../api/WeeklyAvgBarChartApi';
import type { WeeklyAvgBarChartApiResponse } from '../types/WeeklyAvgBarChartTypes';

// API 실패 시 보여줄 fallback 목데이터 (5주치)
const mockWeeklyGraph = [6.5, 8, 9.5, 7, 8.5];

export function useWeeklyAvgBarChart(userId: string) {
  const [weeklyGraph, setWeeklyGraph] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setWeeklyGraph(mockWeeklyGraph);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetchWeeklyAvgBarChart(userId)
      .then((data: WeeklyAvgBarChartApiResponse) => {
        setWeeklyGraph(data.weekly_graph);
      })
      .catch((e: Error) => {
        setError(e.message || '네트워크 오류');
        setWeeklyGraph(mockWeeklyGraph);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { weeklyGraph, loading, error };
}
