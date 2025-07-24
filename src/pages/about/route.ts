import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/processes/routing/lib/rootRoute'
import AboutPage from './ui/AboutPage'

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
})
