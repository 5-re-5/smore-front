// src/features/my-page/graphs/api/WeeklyBarChartApi.ts
import { request, REQUEST_METHOD } from '@/shared/api/request';
import type { WeeklyBarChartApiResponse } from '../types/WeeklyBarChartTypes';

const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const fetchWeeklyBarChart = (userId: string) => {
  const token = getToken();

  return request<WeeklyBarChartApiResponse>({
    method: REQUEST_METHOD.GET,
    url: `/api/v1/study-times/statistics/${userId}`,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).then((res) => res.data);
};
