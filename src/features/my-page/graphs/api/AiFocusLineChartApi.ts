//AiFocusLineChartApi.ts
import { request, REQUEST_METHOD } from '@/shared/api/request';
import type { AiInsightsApiResponse } from '../types/AiFocusLineChartTypes';

export const getAiFocusInsights = (userId: string) =>
  request<AiInsightsApiResponse>({
    method: REQUEST_METHOD.GET,
    url: `/api/v1/focus-records/${userId}`, // baseURL 포함
  });
