import { useUserStore, useUserInfo, useLogoutMutation } from '@/entities/user';

export const useHeaderLogic = () => {
  const { isLogin, uid, reset } = useUserStore();
  const { data: userInfo } = useUserInfo(isLogin ? uid : null);
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        reset();
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
