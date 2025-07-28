import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Provider as QueryProvider } from '@/shared/lib/reactQuery/Provider';
import { router } from '@/app/routing/config/router';

import '@/app/styles.css';
import reportWebVitals from '@/app/reportWebVitals';

const showDevtools =
  import.meta.env.DEV && import.meta.env.VITE_BRANCH === 'dev';

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryProvider>
        <RouterProvider router={router} />
        {showDevtools && <ReactQueryDevtools buttonPosition="bottom-right" />}
      </QueryProvider>
    </StrictMode>,
  );
}

reportWebVitals();
