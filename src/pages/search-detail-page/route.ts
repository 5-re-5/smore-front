import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/__root';
import SearchDetailPage from './ui/SearchDetailPage';
import { z } from 'zod';

export const searchDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search-detail',
  validateSearch: z.object({ q: z.string().min(1) }),
  component: SearchDetailPage,
});
