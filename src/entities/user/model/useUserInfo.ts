import { useUserProfileQuery } from '../api/queries';
import { useAuth } from './useAuth';

export const useUserInfo = (userId?: number | null) => {
  const { getUserId } = useAuth();

  // userId가 전달되면 사용, 없으면 인증 스토어에서 가져오기
  const targetUserId = userId ?? getUserId();

  return useUserProfileQuery(targetUserId ?? 0);
};
