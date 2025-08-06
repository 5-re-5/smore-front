import { request, REQUEST_METHOD } from '@/shared/api/request';
import type { RecentStudyResponse } from '@/entities/study';

export const getRecentStudy = async (userId: string) => {
  const response = await request<RecentStudyResponse>({
    url: `/api/v1/users/${userId}/recent-study`,
    method: REQUEST_METHOD.GET,
  });

  return response.data;
};
