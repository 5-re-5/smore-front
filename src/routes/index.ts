// src/routes/index.ts
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Homepage from '@/pages/homepage/ui/Homepage'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Homepage,
})
