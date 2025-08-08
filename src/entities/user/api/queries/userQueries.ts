import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../userApi';

export const userProfileQueryKeys = {
  all: ['user'] as const,
  profile: (userId: number) =>
    [...userProfileQueryKeys.all, 'profile', userId] as const,
};

export const useUserProfileQuery = (userId: number) => {
  return useQuery({
    queryKey: userProfileQueryKeys.profile(userId),
    queryFn: () => getUserProfile(userId),
    enabled: userId > 0,
  });
};
