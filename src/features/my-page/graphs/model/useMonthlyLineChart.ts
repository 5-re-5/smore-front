//useMonthlyLineChart.ts
import { useState, useEffect } from 'react';
import { fetchMonthlyStudyStatistics } from '../api/MonthlyLineChartApi';
import type { ApiResponseForm } from '@/shared/api/request';
import type {
  ApiDayData,
  MonthlyLineChartApiResponse,
} from '../types/MonthlyLineChartTypes';

// 목데이터: 30일간 0분
const mockMonth: ApiDayData[] = Array.from({ length: 30 }, (_, i) => ({
  date: `2025-07-${String(i + 1).padStart(2, '0')}`,
  minutes: 0,
}));

export function useMonthlyLineChart(userId: string) {
  const [monthTrack, setMonthTrack] = useState<ApiDayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setMonthTrack(mockMonth);
      setError('userId 없음');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchMonthlyStudyStatistics(userId)
      .then((res: ApiResponseForm<MonthlyLineChartApiResponse>) => {
        // res.data === MonthlyLineChartApiResponse
        const points = res.data?.study_track?.points || mockMonth;
        setMonthTrack(points);
      })
      .catch((err) => {
        console.error('[MonthlyLineChart] API 실패 → mock 사용', err);
        setError(err.message ?? 'API 오류');
        setMonthTrack(mockMonth);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { monthTrack, loading, error };
}
