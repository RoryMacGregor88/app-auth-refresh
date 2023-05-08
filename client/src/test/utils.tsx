import { JSXElementConstructor, ReactElement } from 'react';

import { QueryClient, QueryClientConfig, QueryClientProvider } from '@tanstack/react-query';
import { RenderHookOptions, RenderHookResult, RenderResult, render, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AuthenticationContextType, AuthenticationProvider } from '~/accounts/authentication/authentication.context';

interface WrapperParams {
  children: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
}
interface Options {
  authInitialState?: Partial<AuthenticationContextType>;
  initialEntries?: string[];
  renderHookOptions?: RenderHookOptions<unknown>;
}

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
};

const customRender = <T, P>(ui: ReactElement, options?: Options): RenderResult<T, P> => {
  const { authInitialState, initialEntries, renderHookOptions } = options ?? {};

  const utils = render(ui, {
    wrapper: ({ children }: WrapperParams): ReactElement => (
      <MemoryRouter initialEntries={initialEntries ?? ['/']}>
        <QueryClientProvider client={new QueryClient(queryClientConfig)}>
          <AuthenticationProvider initialState={authInitialState ?? {}}>{children}</AuthenticationProvider>
        </QueryClientProvider>
      </MemoryRouter>
    ),
    ...renderHookOptions,
  });

  return utils as RenderResult<T, P>;
};

/**
 * Custom renderHook to replace renderHook from testing library
 *
 * @param callback - callback that wraps the hook being tested
 * @param options - An options object to modify the execution of renderHook
 *
 * @returns - object, see here for shape: https://react-hooks-testing-library.com/reference/api#renderhook-result
 */
const customRenderHook = <T, P>(callback: () => unknown, options?: Options): RenderHookResult<T, P> => {
  const { authInitialState, initialEntries, renderHookOptions } = options ?? {};

  const wrapper = ({ children }: WrapperParams): ReactElement => (
    <MemoryRouter initialEntries={initialEntries ?? ['/']}>
      <QueryClientProvider client={new QueryClient(queryClientConfig)}>
        <AuthenticationProvider initialState={authInitialState}>{children}</AuthenticationProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );

  const utils = renderHook(() => callback(), { wrapper, ...renderHookOptions });
  return utils as RenderHookResult<T, P>;
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
// override render export
export { customRender as render };
// overide renderHook export
export { customRenderHook as renderHook };
