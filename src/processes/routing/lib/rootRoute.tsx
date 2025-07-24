// src/processes/routing/lib/root-route.ts
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const showDevtools =
  import.meta.env.DEV && import.meta.env.VITE_BRANCH === 'dev'
const createRoot = createRootRouteWithContext<{ queryClient: unknown }>()

export const rootRoute = createRoot({
  component: () => (
    <>
      <Outlet />
      {showDevtools && <TanStackRouterDevtools />}
    </>
  ),
})
