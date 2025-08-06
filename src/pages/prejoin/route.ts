import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/__root';
import PrejoinPage from './ui/PrejoinPage';

export const prejoinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/room/$roomId/prejoin',
  component: PrejoinPage,
  validateSearch: (search) => {
    // 추가 쿼리 파라미터가 필요한 경우 여기서 검증
    return search as Record<string, unknown>;
  },
});
