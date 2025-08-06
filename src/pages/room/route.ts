import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/__root';
import RoomPage from './ui/RoomPage.tsx';

export const roomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/room/$roomId',
  component: RoomPage,
  validateSearch: (search) => {
    // 토큰이나 기타 쿼리 파라미터 검증
    return search as Record<string, unknown>;
  },
});
