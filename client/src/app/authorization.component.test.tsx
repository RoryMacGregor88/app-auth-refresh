/*eslint import/namespace: ["off"]*/
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { render, screen, waitFor } from '~/test/test-renderers';

import { Authorization } from './authorization.component';
import { User } from '../accounts/users/users.hook';

interface Args {
  user: User | null;
  roles: number[];
  accessToken?: string | undefined;
}
const TestComponentContent = 'Test Component Content';
const TestComponent = () => <p>{TestComponentContent}</p>;

const TestUnauthorizedComponentContent = 'Test Unauthorized Component Content';
const TestUnauthorizedComponent = () => <p>{TestUnauthorizedComponentContent}</p>;

const TestLoginComponentContent = 'Test Login Component Content';
const TestLoginComponent = () => <p>{TestLoginComponentContent}</p>;

const mockUser = {
  _id: '123',
  email: 'user@example.com',
  name: 'John Smith',
  password: '123456',
  refreshTokens: ['123', '456'],
  roles: [2],
};

const renderComponent = ({ user = null, roles = [], accessToken }: Args) =>
  render(
    <Routes>
      <Route element={<Authorization roles={roles} user={user} />}>
        <Route element={<TestComponent />} path="/" />
      </Route>
      <Route element={<TestUnauthorizedComponent />} path="/unauthorized" />
      <Route element={<TestLoginComponent />} path="/login" />
    </Routes>,
    { authInitialState: { accessToken } },
  );

describe('authorization', () => {
  it('should render children if access token and user has correct role', () => {
    renderComponent({ user: mockUser, roles: [2], accessToken: 'test-access-token' });

    expect(screen.getByText(TestComponentContent)).toBeInTheDocument();
  });

  it('should redirect user to the unauthorized path if accessToken exists', async () => {
    renderComponent({ user: mockUser, roles: [1], accessToken: 'test-access-token' });

    await waitFor(() => {
      expect(screen.getByText(TestUnauthorizedComponentContent)).toBeInTheDocument();
    });
  });

  it('should redirect user to the login path if accessToken does not exist', async () => {
    renderComponent({ user: mockUser, roles: [1] });

    await waitFor(() => {
      expect(screen.getByText(TestLoginComponentContent)).toBeInTheDocument();
    });
  });
});
