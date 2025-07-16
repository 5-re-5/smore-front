// src/app/router.ts
import { createRouter } from '@tanstack/react-router'
import { rootRoute } from '@/routes/__root'
import { indexRoute } from '@/routes/index'
import { getContext } from '@/shared/lib/reactQuery/Provider'

const routeTree = rootRoute.addChildren([
  indexRoute,
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
