import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/__root';
import SearchDetailPage from './ui/SearchDetailPage';

export const searchDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search-detail',
  // ✅ search 타입 선언
  validateSearch: (search: Record<string, unknown>): { q?: string } => {
    return { q: typeof search.q === 'string' ? search.q : undefined };
  },
  component: SearchDetailPage,
});
