import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/__root';
import LoginPage from './ui/LoginPage';

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});
