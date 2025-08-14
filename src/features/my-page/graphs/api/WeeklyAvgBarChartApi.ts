import { request, REQUEST_METHOD } from '@/shared/api/request';
import type { WeeklyAvgBarChartApiResponse } from '../types/WeeklyAvgBarChartTypes';

export const fetchWeeklyAvgBarChart = (userId: string) =>
  request<WeeklyAvgBarChartApiResponse>({
    method: REQUEST_METHOD.GET,
    url: `/api/v1/study-times/statistics/${userId}`, // BASE_URL 내부 처리
  }).then((res) => res.data);
