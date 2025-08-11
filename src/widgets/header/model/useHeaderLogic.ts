import { useAuth, useUserInfo } from '@/entities/user';

export const useHeaderLogic = () => {
  const { isAuthenticated, handleLogout } = useAuth();
  const { data: userInfo } = useUserInfo();

  return {
    isLogin: isAuthenticated,
    userInfo: userInfo || { nickname: '', profileUrl: '' },
    handleLogout,
  };
};
