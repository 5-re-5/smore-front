import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables); //중복 캔버스 사용 문제 방지. 차트 정상 동작용

import { router } from '@/app/routing/config/router';
import { Provider as QueryProvider } from '@/shared/lib/reactQuery/Provider';
import { Toaster } from '@/shared/ui';

import reportWebVitals, { logWebVitals } from '@/app/reportWebVitals';
import '@/app/styles.css';

// MSW 설정
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  // MSW 활성화 환경변수 체크
  if (import.meta.env.VITE_MSW_ENABLED === 'false') {
    console.log('🚫 MSW: Disabled by environment variable');
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
          <Toaster />
          {showDevtools && <ReactQueryDevtools buttonPosition="bottom-right" />}
        </QueryProvider>
      </StrictMode>,
    );
  });
}

reportWebVitals(logWebVitals);
