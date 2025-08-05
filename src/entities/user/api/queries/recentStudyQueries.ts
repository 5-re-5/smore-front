import { useQuery } from '@tanstack/react-query';
import { getRecentStudy } from '../recentStudy';
import type { RecentStudyResponse } from '@/entities/study';

export const RECENT_STUDY_QUERY_KEY = {
  all: ['recentStudy'] as const,
  byUserId: (userId: string) =>
    [...RECENT_STUDY_QUERY_KEY.all, userId] as const,
};

export const useRecentStudyQuery = (userId: string) => {
  return useQuery<RecentStudyResponse>({
    queryKey: RECENT_STUDY_QUERY_KEY.byUserId(userId),
    queryFn: () => getRecentStudy(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};
