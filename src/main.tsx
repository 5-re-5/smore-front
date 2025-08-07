import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { router } from '@/app/routing/config/router';
import { Provider as QueryProvider } from '@/shared/lib/reactQuery/Provider';

import reportWebVitals, { logWebVitals } from '@/app/reportWebVitals';
import '@/app/styles.css';

// MSW 설정
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  const { worker } = await import('@/shared/api/mocks');

  console.log('🔧 MSW: Starting worker...');

  return worker
    .start({
      onUnhandledRequest: 'bypass',
    })
    .then(() => {
      console.log('✅ MSW: Worker started successfully');
    });
}

const showDevtools =
  import.meta.env.DEV && import.meta.env.VITE_BRANCH === 'dev';

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  enableMocking().then(() => {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <StrictMode>
        <QueryProvider>
          <RouterProvider router={router} />
          {showDevtools && <ReactQueryDevtools buttonPosition="bottom-right" />}
        </QueryProvider>
      </StrictMode>,
    );
  });
}

reportWebVitals(logWebVitals);
