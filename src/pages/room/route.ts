import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/lib/rootRoute';
import RoomPage from './ui/RoomPage';

export const roomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/room',
  component: RoomPage,
});
