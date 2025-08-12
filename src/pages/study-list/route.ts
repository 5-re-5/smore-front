import { createRoute, redirect } from '@tanstack/react-router';
import StudyListPage from './ui/StudyListPage';
import { rootRoute } from '@/app/routing/__root';

export const studyListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/study-list',
  // ✅ search 타입 선언
  validateSearch: (search: Record<string, unknown>): { q?: string } => {
    return { q: typeof search.q === 'string' ? search.q : undefined };
  },
  // 핫픽스: /study-list?q=... 들어오면 검색 상세로 교정
  beforeLoad: ({ search }) => {
    if (search.q) {
      throw redirect({ to: '/search-detail', search: { q: search.q } });
    }
  },
  component: StudyListPage,
});

// 백엔드 호환성을 위한 리다이렉트 라우트
export const studyListRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/studyList',
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/study-list',
      search,
    });
  },
});
