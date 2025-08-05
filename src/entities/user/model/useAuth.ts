import { useRouter } from '@tanstack/react-router';
import { useAuthStore } from './useAuthStore';
import { useLogoutMutation } from '../api/mutations';

export const useAuth = () => {
  const router = useRouter();
  const store = useAuthStore();
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        store.logout();
        router.navigate({ to: '/' });
      },
      onError: (error) => {
        console.error('로그아웃 실패:', error);
        store.logout();
        router.navigate({ to: '/' });
      },
    });
  };

  return {
    userInfo: store.userInfo,
    userId: store.userId,
    isAuthenticated: store.isAuthenticated(),
    login: store.login,
    logout: store.logout,
    handleLogout,
    getUserId: store.getUserId,
    setUserInfo: store.setUserInfo,
  };
};
