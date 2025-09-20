import { useAuth, useUserInfo } from '@/entities/user';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';

export const useHeaderLogic = () => {
  const { isAuthenticated, handleLogout } = useAuth();
  const { data: userInfo } = useUserInfo();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;

    const publicPaths = ['/', '/login'];

    if (isAuthenticated && publicPaths.includes(currentPath)) {
      navigate({ to: '/study-list', replace: true });
      return;
    }

    const isPublicPath = publicPaths.some((path) => {
      if (path === '/') return currentPath === '/';
      return currentPath.startsWith(path);
    });

    if (!isAuthenticated && !isPublicPath) {
      // navigate({ to: '/login', replace: true });
      return;
    }
  }, [isAuthenticated, navigate, location]);

  return {
    isLogin: isAuthenticated,
    userInfo: userInfo || { nickname: '', profileUrl: '' },
    handleLogout,
  };
};
