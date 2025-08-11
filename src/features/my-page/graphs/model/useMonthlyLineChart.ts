import { useState, useEffect } from 'react';
import { fetchMonthlyStudyStatistics } from '../api/MonthlyLineChartApi';
import type { ApiDayData } from '../types/MonthlyLineChartTypes';

export function useMonthlyLineChart(userId: string) {
  const [thisMonth, setThisMonth] = useState<ApiDayData[]>([]);
  const [lastMonth, setLastMonth] = useState<ApiDayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMonthlyStudyStatistics(userId)
      .then((data) => {
        setThisMonth(data.data.this_month_track.points);
        setLastMonth(data.data.last_month_track.points);
      })
      .catch(() => {
        setThisMonth([]);
        setLastMonth([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { thisMonth, lastMonth, loading };
}
