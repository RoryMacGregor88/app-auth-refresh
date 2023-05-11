import { FC, ReactElement } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

import { AuthenticationProvider } from '~/accounts/authentication/authentication.context';

interface Props {
  children: ReactElement;
}

export const StoryWrapper: FC<Props> = ({ children }): ReactElement => (
  <MemoryRouter>
    <QueryClientProvider client={new QueryClient()}>
      <AuthenticationProvider>{children}</AuthenticationProvider>
    </QueryClientProvider>
  </MemoryRouter>
);
