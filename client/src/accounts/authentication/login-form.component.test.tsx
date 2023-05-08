/*eslint import/namespace: ["off"]*/
import { describe, expect, it, vi } from 'vitest';

import {
  EMAIL_REQUIRED_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from '~/accounts/accounts.constants';
import { LoginForm, LoginUser } from '~/accounts/authentication/login-form.component';
import { render, screen, userEvent, waitFor } from '~/test/utils';

const requiredMessages = {
  email: EMAIL_REQUIRED_MESSAGE,
  password: PASSWORD_REQUIRED_MESSAGE,
};

let loginUser: LoginUser;

describe('Login Form', () => {
  beforeEach(() => {
    loginUser = vi.fn();
  });

  it('should successfully log user in', async () => {
    render(<LoginForm error={null} loginUser={loginUser} />);

    const email = 'test@email.com';
    const password = '123456';

    await userEvent.type(screen.getByRole('textbox', { name: 'email' }), email);
    await userEvent.type(screen.getByLabelText('password'), password);

    const submitButton = screen.getByRole('button', { name: 'Login' });
    expect(submitButton).toBeEnabled();

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({ email, password });
    });
  });

  it('should disable submit button if form is not dirty', () => {
    render(<LoginForm error={null} loginUser={loginUser} />);

    expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled();
  });

  it('should disable submit button if form is invalid', async () => {
    render(<LoginForm error={null} loginUser={loginUser} />);

    const email = 'invalid email';
    const password = '123456';

    await userEvent.type(screen.getByRole('textbox', { name: 'email' }), email);
    await userEvent.type(screen.getByLabelText('password'), password);

    const submitButton = screen.getByRole('button', { name: 'Login' });

    expect(submitButton).toBeDisabled();
  });

  it.each(['email', 'password'])('should show error if %s field is empty', async name => {
    render(<LoginForm error={null} loginUser={loginUser} />);

    const submitButton = screen.getByRole('button', { name: 'Register' });

    expect(submitButton).toBeDisabled();

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(requiredMessages[name])).toBeInTheDocument();
    });

    expect(loginUser).not.toHaveBeenCalled();
  });

  it('should display error well if error is present', async () => {
    const message = 'test-error-message';

    render(<LoginForm error={{ message }} loginUser={loginUser} />);

    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
