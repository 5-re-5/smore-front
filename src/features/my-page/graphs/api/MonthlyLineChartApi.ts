//MonthlyLineChartApi.ts
import { request } from '@/shared/api/request';
import type { MonthlyLineChartApiResponse } from '../types/MonthlyLineChartTypes';

export const fetchMonthlyStudyStatistics = (userId: string) =>
  request<MonthlyLineChartApiResponse>({
    method: 'get',
    url: `/api/v1/study-times/statistics/${userId}`,
  });
