import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/lib/rootRoute';
import RoomPage from './ui/RoomPage';

export const roomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/room',
  component: RoomPage,
  validateSearch: (search) => {
    if (!search.roomName) throw new Error('roomName is required');
    return {
      roomName: String(search.roomName),
    };
  },
});
