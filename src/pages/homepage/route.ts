import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/__root';
import HomePage from './ui/HomePage';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});
