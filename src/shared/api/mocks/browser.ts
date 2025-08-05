import { setupWorker } from 'msw/browser';
import { handlers } from './handlers/index';

console.log('🔧 MSW: Handler configuration:', {
  VITE_MOCK_USER_API: import.meta.env.VITE_MOCK_USER_API,
  handlersCount: handlers.length,
  handlers: handlers.map((h) => h.info.method + ' ' + h.info.path),
});

export const worker = setupWorker(...handlers);
