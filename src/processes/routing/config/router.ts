import { createRouter } from '@tanstack/react-router'
import { indexRoute } from '@/pages/homepage/route'
import { getContext } from '@/shared/lib/reactQuery/Provider'
import { rootRoute } from '../lib/rootRoute'
import { aboutRoute } from '@/pages/about/route'

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  // 여기에 다른 route 추가 가능
])

export const router = createRouter({
  routeTree,
  context: getContext(),
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
