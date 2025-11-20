import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export async function startMockWorker() {
  if (import.meta.env.PROD) return;
  await worker.start({ onUnhandledRequest: 'bypass' });
  console.info('[MSW] worker started');
}
