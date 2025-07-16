import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/processes/routing/lib/rootRoute'
import Homepage from './ui/Homepage'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Homepage,
})
