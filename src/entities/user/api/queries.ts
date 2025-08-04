import { useQuery } from '@tanstack/react-query';
import { getUser } from './userApi';
import type { GetUserRequest } from './types';

export const userQueryKeys = {
  all: ['user'] as const,
  user: (userId: number) => [...userQueryKeys.all, userId] as const,
};

export const useUserQuery = ({ userId }: GetUserRequest) => {
  return useQuery({
    queryKey: userQueryKeys.user(userId),
    queryFn: () => getUser({ userId }),
    enabled: userId > 0,
  });
};
