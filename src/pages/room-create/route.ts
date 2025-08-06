import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/__root';
import RoomCreatePage from './ui/RoomCreatePage';

export const roomCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/room-create',
  component: RoomCreatePage,
});
