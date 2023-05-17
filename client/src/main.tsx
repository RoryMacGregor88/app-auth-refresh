import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { AuthenticationProvider } from '~/accounts/authentication/authentication.context';
import { App } from '~/app/app.component';

import './i18n/i18n';

import './index.css';

const queryClientConfig = {
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      retries: false,
    },
    mutations: {
      useErrorBoundary: true,
      retries: false,
    },
  },
};
const queryClient = new QueryClient(queryClientConfig);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <AuthenticationProvider>
          <App />
        </AuthenticationProvider>
      </React.StrictMode>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </BrowserRouter>,
);

if (import.meta.env.DEV) {
  const axe = await import('@axe-core/react');
  axe.default(React, ReactDOM, 1000);
}

// Don't use MSW when docker running, only during local development.
if (import.meta.env.VITE_USE_MSW) {
  console.log('SETUP MOCK SERVICE WORKER');
  const { worker } = await import('~/mocks/browser');
  worker.start();
}
