import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/lib/rootRoute';
import Homepage from './ui/Homepage';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Homepage,
});
