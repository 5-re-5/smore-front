// src/pages/edit-page/route.ts
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/app/routing/__root';
import EditPage from './ui/EditPage';

export const editPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/edit-page',
  component: EditPage,
});
