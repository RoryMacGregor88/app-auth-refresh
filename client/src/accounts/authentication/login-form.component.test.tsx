/*eslint import/namespace: ["off"]*/
import { describe, expect, it, vi } from 'vitest';

import {
  EMAIL_REQUIRED_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from '~/accounts/accounts.constants';
import { LoginForm, LoginUser } from '~/accounts/authentication/login-form.component';
import { render, screen, userEvent, waitFor } from '~/test/test-renderers';

let loginUser: LoginUser;

describe('Login Form', () => {
  beforeEach(() => {
    loginUser = vi.fn();
  });

  it('should disable submit button if form is not dirty', () => {
    render(<LoginForm loginUser={loginUser} />);

    expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled();
  });

  it('should disable submit button if form is invalid', async () => {
    render(<LoginForm loginUser={loginUser} />);

    const email = 'invalid email';
    const password = '123456';

    await userEvent.type(screen.getByRole('textbox', { name: 'Email * :' }), email);
    await userEvent.type(screen.getByTestId('password'), password);

    expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled();
    expect(screen.getByText(INVALID_EMAIL_MESSAGE)).toBeInTheDocument();
  });

  it('should show error if email field is empty', async () => {
    render(<LoginForm loginUser={loginUser} />);

    const password = '123456';

    await userEvent.type(screen.getByTestId('password'), password);

    userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText(EMAIL_REQUIRED_MESSAGE)).toBeInTheDocument();
    });

    expect(loginUser).not.toHaveBeenCalled();
  });

  it('should show error if password field is empty', async () => {
    render(<LoginForm loginUser={loginUser} />);

    const email = 'test@email.com';

    await userEvent.type(screen.getByRole('textbox', { name: 'Email * :' }), email);

    userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText(PASSWORD_REQUIRED_MESSAGE)).toBeInTheDocument();
    });

    expect(loginUser).not.toHaveBeenCalled();
  });

  it('should successfully log user in', async () => {
    render(<LoginForm loginUser={loginUser} />);

    const email = 'test@email.com';
    const password = '123456';

    await userEvent.type(screen.getByRole('textbox', { name: 'Email * :' }), email);
    await userEvent.type(screen.getByTestId('password'), password);

    const submitButton = screen.getByRole('button', { name: 'Login' });
    expect(submitButton).toBeEnabled();

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({ email, password });
    });
  });
});
