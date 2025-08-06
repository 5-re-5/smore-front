import { useQuery } from '@tanstack/react-query';
import { getUser, getUserProfile } from './userApi';
import type { GetUserRequest } from './types';

export const userQueryKeys = {
  all: ['user'] as const,
  user: (userId: number) => [...userQueryKeys.all, userId] as const,
  profile: (userId: number) =>
    [...userQueryKeys.all, 'profile', userId] as const,
};

export const useUserQuery = ({ userId }: GetUserRequest) => {
  return useQuery({
    queryKey: userQueryKeys.user(userId),
    queryFn: () => getUser({ userId }),
    enabled: userId > 0,
  });
};
export const useUserProfileQuery = (userId: number) => {
  return useQuery({
    queryKey: userQueryKeys.profile(userId),
    queryFn: () => getUserProfile(userId),
    enabled: userId > 0,
  });
};
