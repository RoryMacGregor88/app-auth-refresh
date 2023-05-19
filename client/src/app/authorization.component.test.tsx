/*eslint import/namespace: ["off"]*/
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { render, screen, waitFor } from '~/test/test-renderers';

import { Authorization } from './authorization.component';
import { User } from '../accounts/users/users.hook';

interface Args {
  user?: User | null;
  roles?: number[];
  accessToken?: string | null;
}

const TestComponentContent = 'Test Component Content';
const TestComponent = () => <p>{TestComponentContent}</p>;

const mockUser = {
  _id: '123',
  email: 'user@example.com',
  password: '123456',
  name: 'John Smith',
  roles: [2],
  refreshTokens: ['123'],
};

const renderComponent = ({ user = null, roles = [], accessToken = '123456' }: Args) => {
  render(
    <Routes>
      <Route element={<Authorization roles={roles} user={user} />}>
        <Route element={<TestComponent />} path="/" />
      </Route>
    </Routes>,
    { authInitialState: { accessToken } },
  );
};

describe('authorization', () => {
  it('should show children if access token and user has role', async () => {
    renderComponent({ user: mockUser, roles: [2] });

    await waitFor(() => {
      expect(screen.getByText(TestComponentContent)).toBeInTheDocument();
    });
  });
});
