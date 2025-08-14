import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/__root';
import MyPage from '@/pages/my-page/ui/MyPage';

export const myPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-page',
  component: MyPage,
});
