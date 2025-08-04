import { useUserQuery } from '../api/queries';

export const useUserInfo = (userId: number | null) => {
  return useUserQuery({ userId: userId ?? 0 });
};
