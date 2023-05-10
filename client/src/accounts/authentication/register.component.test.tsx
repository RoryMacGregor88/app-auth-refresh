/*eslint import/namespace: ["off"]*/
import { describe, expect, it } from 'vitest';

import { ACCOUNT_CREATED_SUCCESS_MESSAGE } from '~/accounts/accounts.constants';
import { HTTP_OK, LOADING_MESSAGE, SERVER_ERROR } from '~/api/api.constants';
import { rest, server } from '~/mocks/server';
import { render, screen, userEvent, waitFor } from '~/test/utils';

import { Register } from './register.component';

const ENDPOINT = 'http://localhost:5000/api/accounts/register/';

describe('Register', () => {
  it('should show loadmask when isLoading is true', () => {
    render(<Register />, { mutationDefaults: { key: ['Register'], defaultValue: { isLoading: true } } });

    expect(screen.getByText(LOADING_MESSAGE)).toBeInTheDocument();
  });

  it('should show error well when isError is true', async () => {
    const error = 'test-error-message';

    server.use(rest.post(ENDPOINT, (req, res, ctx) => res(ctx.status(SERVER_ERROR), ctx.json(error))));

    render(<Register />);

    const email = 'test@email.com';
    const password = '123456';
    const confirmPassword = '123456';
    const firstName = 'John';
    const lastName = 'Smith';

    await userEvent.type(screen.getByRole('textbox', { name: 'Email * :' }), email);
    await userEvent.type(screen.getByTestId('password'), password);
    await userEvent.type(screen.getByTestId('confirmPassword'), confirmPassword);
    await userEvent.type(screen.getByRole('textbox', { name: 'First Name * :' }), firstName);
    await userEvent.type(screen.getByRole('textbox', { name: 'Last Name * :' }), lastName);

    userEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText(error)).toBeInTheDocument();
    });
  });

  it('should call onRegister function when form valid and submitted', async () => {
    const response = { id: 1 };

    server.use(rest.post(ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_OK), ctx.json(response))));

    render(<Register />);

    const email = 'test@email.com';
    const password = '123456';
    const confirmPassword = '123456';
    const firstName = 'John';
    const lastName = 'Smith';

    await userEvent.type(screen.getByRole('textbox', { name: 'Email * :' }), email);
    await userEvent.type(screen.getByTestId('password'), password);
    await userEvent.type(screen.getByTestId('confirmPassword'), confirmPassword);
    await userEvent.type(screen.getByRole('textbox', { name: 'First Name * :' }), firstName);
    await userEvent.type(screen.getByRole('textbox', { name: 'Last Name * :' }), lastName);

    userEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText(ACCOUNT_CREATED_SUCCESS_MESSAGE)).toBeInTheDocument();
    });
  });
});
