import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

export const rootRoute = createRootRouteWithContext<{
  queryClient: unknown;
}>()({
  component: () => Outlet,
});
