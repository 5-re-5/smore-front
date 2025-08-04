import { createRoute } from '@tanstack/react-router';
import AboutPage from './ui/AboutPage';
import { rootRoute } from '@/app/routing/__root';

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});
