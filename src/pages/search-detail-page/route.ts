import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/__root';
import SearchDetailPage from './ui/SearchDetailPage';

export const searchDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search-detail-page',
  component: SearchDetailPage,
});
