import { useQuery } from '@tanstack/react-query';
import { getRecentStudy } from '../recentStudy';
import type { RecentStudyResponse } from '@/entities/study';

export const recentStudyQueryKeys = {
  all: ['recentStudy'] as const,
  byUserId: (userId: string) => [...recentStudyQueryKeys.all, userId] as const,
};

export const useRecentStudyQuery = (userId: string) => {
  return useQuery<RecentStudyResponse>({
    queryKey: recentStudyQueryKeys.byUserId(userId),
    queryFn: () => getRecentStudy(userId),
    enabled: !!userId,
  });
};
