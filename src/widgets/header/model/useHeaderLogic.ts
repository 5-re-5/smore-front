import { useUserStore, useUserInfo, useLogoutMutation } from '@/entities/user';
import { useRouter } from '@tanstack/react-router';

export const useHeaderLogic = () => {
  const router = useRouter();
  const { isLogin, uid, reset } = useUserStore();
  const { data: userInfo } = useUserInfo(isLogin ? uid : null);
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        reset();
        router.navigate({ to: '/' });
      },
      onError: (error) => {
        console.error('로그아웃 실패:', error);
      },
    });
  };

  return {
    isLogin,
    userInfo: userInfo?.user || { nickname: '', profileUrl: '' },
    handleLogout,
  };
};
