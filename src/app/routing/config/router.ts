import { createRouter } from '@tanstack/react-router';
import { indexRoute } from '@/pages/homepage/route';
import { getContext } from '@/shared/lib/reactQuery/context';
import { rootRoute } from '../__root';
import { aboutRoute } from '@/pages/about/route';
import { roomRoute } from '@/pages/room/route';
import { prejoinRoute } from '@/pages/prejoin/route';
import { loginRoute } from '@/pages/login/route';
import {
  studyListRoute,
  studyListRedirectRoute,
} from '@/pages/studyList/route';
import { roomCreateRoute } from '@/pages/room-create/route';
import { myPageRoute } from '@/pages/my-page/route';

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  roomRoute,
  prejoinRoute,
  loginRoute,
  studyListRoute,
  studyListRedirectRoute,
  roomCreateRoute,
  myPageRoute,
  // 여기에 다른 route 추가 가능
]);

export const router = createRouter({
  routeTree,
  context: getContext(),
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
