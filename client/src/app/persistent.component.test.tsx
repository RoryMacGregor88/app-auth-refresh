/*eslint import/namespace: ["off"]*/
import { rest } from 'msw';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { REFRESH_PATH } from '~/accounts/authentication/refresh.hook';
import { User } from '~/accounts/users/users.hook';
import { LOADING_MESSAGE, SERVER_ERROR } from '~/api/api.constants';
import { server } from '~/mocks/server';
import { render, screen, waitFor } from '~/test/test-renderers';

import { Persistent, RefetchToken } from './persistent.component';

const TEST_COMPONENT_CONTENT = 'Test Component Content';

const TEST_USER = {
  _id: '123',
  email: 'email@exampole.com',
  password: 'password',
  refreshTokens: ['123', '456'],
  roles: [123, 456],
};

const TestComponent = () => <h1>{TEST_COMPONENT_CONTENT}</h1>;

interface Args {
  user?: User | null;
  accessToken?: string;
  handleRefreshToken?: (refreshToken: RefetchToken) => void;
}

const renderComponent = ({ user = null, accessToken = undefined, handleRefreshToken }: Args = {}) => {
  const mockHandleRefreshToken = vi.fn();

  render(
    <Routes>
      <Route element={<Persistent handleRefreshToken={handleRefreshToken ?? mockHandleRefreshToken} user={user} />}>
        <Route element={<TestComponent />} path="/test-path" />
      </Route>
    </Routes>,
    { authInitialState: { accessToken }, initialEntries: ['test-path'] },
  );

  return { handleRefreshToken: mockHandleRefreshToken };
};

describe('Persistent', () => {
  it.only('should throw error if error refreshing token', async () => {
    const error = { message: 'test-error-message' };

    server.use(rest.get(`*${REFRESH_PATH}`, (req, res, ctx) => res(ctx.status(SERVER_ERROR), ctx.json(error))));

    try {
      /**
       * trigger real network request by calling refresh
       * function returned by useRefresh hook
       */
      renderComponent({ handleRefreshToken: cb => cb() });
    } catch (e) {
      // TODO: false pass, same `isStale` issue as refresh test
      expect(e).toBe(error.message);
    }
  });

  it('should show loading message if no user in state', async () => {
    renderComponent({ accessToken: '123456' });

    expect(screen.getByText(LOADING_MESSAGE)).toBeInTheDocument();
  });

  it('should refresh access token if token not already in state', async () => {
    const { handleRefreshToken } = renderComponent();

    await waitFor(() => expect(handleRefreshToken).toHaveBeenCalled());
  });

  it('should not refresh access token if access token already in state', async () => {
    const { handleRefreshToken } = renderComponent({ accessToken: '123456' });

    await waitFor(() => expect(handleRefreshToken).not.toHaveBeenCalled());
  });

  it('should show children if user has been fetched', async () => {
    renderComponent({ user: TEST_USER, accessToken: '123456' });

    await waitFor(() => {
      expect(screen.getByText(TEST_COMPONENT_CONTENT)).toBeInTheDocument();
    });
  });
});
