import React from 'react';
import type { Preview } from '@storybook/react';
import { QueryClient, QueryClientConfig, QueryClientProvider } from '@tanstack/react-query';
import { AuthenticationProvider } from '../src/accounts/authentication/authentication.context';
import i18n from './i18n';
import { MemoryRouter } from 'react-router-dom';

import 'tailwindcss/tailwind.css';

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'dark',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'light', title: 'Light', left: '☀️' },
        { value: 'dark', title: 'Dark', left: '🌒' },
      ],
    },
  },
};

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      retry: false,
    },
    mutations: {
      useErrorBoundary: true,
      retry: false,
    },
  },
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    i18n,
    locale: 'en',
    locales: {
      en: { title: 'English', left: '🇬🇧' },
      fr: { title: 'Français', left: '🇫🇷' },
    },
  },
  decorators: [
    Story => (
      <MemoryRouter>
        <QueryClientProvider client={new QueryClient(queryClientConfig)}>
          <AuthenticationProvider>
            <Story />
          </AuthenticationProvider>
        </QueryClientProvider>
      </MemoryRouter>
    ),
  ],
};

export default preview;
