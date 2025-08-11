import { request, REQUEST_METHOD } from '@/shared/api/request';
import type { AiInsightsApiResponse } from '../types/AiFocusLineChartTypes';

export const getAiFocusInsights = (userId: string) => {
  return request<AiInsightsApiResponse>({
    method: REQUEST_METHOD.GET,
    url: `${import.meta.env.VITE_BACK_URL}/api/v1/focus-records/${userId}`,
  });
};
