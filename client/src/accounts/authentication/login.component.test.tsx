/*eslint import/namespace: ["off"]*/
import { describe, expect, it } from 'vitest';

import { HTTP_OK, SERVER_ERROR } from '~/api/api.constants';
import { rest, server } from '~/mocks/server';
import { render, screen, userEvent, waitFor } from '~/test/test-renderers';

import { Login } from './login.component';

const ACCOUNTS_ENDPOINT = 'http://localhost:5000/api/accounts';
const USERS_ENDPOINT = 'http://localhost:5000/api/users/123';

describe('Login', () => {
  it('should show error well when isLoginError is true', async () => {
    const error = { message: 'test-error-message' };

    server.use(rest.post(ACCOUNTS_ENDPOINT, (req, res, ctx) => res(ctx.status(SERVER_ERROR), ctx.json(error))));

    render(<Login />);

    const email = 'test@email.com';
    const password = '123456';

    await userEvent.type(screen.getByRole('textbox', { name: 'Email * :' }), email);
    await userEvent.type(screen.getByTestId('password'), password);

    userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText(error.message)).toBeInTheDocument();
    });
  });

  it('should show error well when isUserError is true', async () => {
    const userConfig = { id: '123', accessToken: '456' };

    const error = { message: 'test-error-message' };

    /** successful login request */
    server.use(rest.post(ACCOUNTS_ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_OK), ctx.json(userConfig))));

    /** failed user request */
    server.use(rest.get(USERS_ENDPOINT, (req, res, ctx) => res(ctx.status(SERVER_ERROR), ctx.json(error))));

    render(<Login />);

    const email = 'test@email.com';
    const password = '123456';

    await userEvent.type(screen.getByRole('textbox', { name: 'Email * :' }), email);
    await userEvent.type(screen.getByTestId('password'), password);

    userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText(error.message)).toBeInTheDocument();
    });
  });
});
