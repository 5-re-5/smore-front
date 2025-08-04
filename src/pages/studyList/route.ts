import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/lib/rootRoute';
import StudyListPage from './ui/StudyListPage';

export const studyListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/study-list',
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
