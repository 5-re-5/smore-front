import { useAuth } from '@/entities/user';
import { useRouter, useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';

interface SearchParams {
  userId?: string;
}

export const useUrlAuth = () => {
  const { login } = useAuth();
  const router = useRouter();
  const search = useSearch({ strict: false }) as SearchParams;

  useEffect(() => {
    const { userId: userIdParam } = search;

    if (!userIdParam) return;

    const parsedUserId = Number(userIdParam);

    if (isNaN(parsedUserId)) return;

    // useAuthStore에 저장 (persist됨)
    login(parsedUserId);

    // URL에서 userId 파라미터 제거
    router.navigate({
      to: '/study-list',
      search: {},
      replace: true,
    });
  }, [search, login, router]);
};
