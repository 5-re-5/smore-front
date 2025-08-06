import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from './userApi';

export const userQueryKeys = {
  all: ['user'] as const,
  profile: (userId: number) =>
    [...userQueryKeys.all, 'profile', userId] as const,
};

export const useUserProfileQuery = (userId: number) => {
  return useQuery({
    queryKey: userQueryKeys.profile(userId),
    queryFn: () => getUserProfile(userId),
    enabled: userId > 0,
  });
};
