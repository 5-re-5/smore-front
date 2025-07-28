import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/lib/rootRoute';
import RoomPage from './ui/Roompage';

export const roomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/room',
  component: RoomPage,
  validateSearch: (search) => {
    if (!search.roomName) {
      throw new Error('Room name is required to join a room');
    }

    const roomName = String(search.roomName).trim();
    if (roomName.length === 0) {
      throw new Error('Room name cannot be empty');
    }
    if (roomName.length > 50) {
      throw new Error('Room name must be 50 characters or less');
    }

    return {
      roomName,
    };
  },
});
