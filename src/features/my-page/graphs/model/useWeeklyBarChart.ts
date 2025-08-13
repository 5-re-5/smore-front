// src/features/my-page/graphs/model/useWeeklyBarChart.ts
import { useState, useEffect } from 'react';
import { fetchWeeklyBarChart } from '../api/WeeklyBarChartApi';
import type { WeeklyBarChartApiResponse } from '../types/WeeklyBarChartTypes';

// API 실패 시 사용할 목데이터
const mockWeekdayGraph = [6, 4, 2, 12, 4, 0, 3];

export function useWeeklyBarChart(userId: string) {
  const [weekdayGraph, setWeekdayGraph] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setWeekdayGraph(mockWeekdayGraph);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchWeeklyBarChart(userId)
      .then((data: WeeklyBarChartApiResponse) => {
        setWeekdayGraph(data.weekday_graph);
      })
      .catch((e: Error) => {
        console.error('[WeeklyBarChart] API 실패 → mock데이터 사용', e);
        setError(e.message ?? '네트워크 오류');
        setWeekdayGraph(mockWeekdayGraph);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { weekdayGraph, loading, error };
}
