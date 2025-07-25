import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/lib/rootRoute';
import Roompage from './ui/Roompage';

export const roomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/room',
  component: Roompage,
});
