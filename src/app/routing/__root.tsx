import { createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { RootLayout } from './components/RootLayout';

const showDevtools =
  import.meta.env.DEV && import.meta.env.VITE_BRANCH === 'dev';

const createRoot = createRootRouteWithContext<{ queryClient: unknown }>();

export const rootRoute = createRoot({
  component: () => (
    <>
      <RootLayout />
      {showDevtools && <TanStackRouterDevtools />}
    </>
  ),
});
