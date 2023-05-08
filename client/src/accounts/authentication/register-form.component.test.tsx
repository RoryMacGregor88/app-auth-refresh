/*eslint import/namespace: ["off"]*/
import { describe, expect, it, vi } from 'vitest';

import {
  CONFIRM_PASSWORD_REQUIRED_MESSAGE,
  EMAIL_REQUIRED_MESSAGE,
  FIRST_NAME_REQUIRED_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  LAST_NAME_REQUIRED_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from '~/accounts/accounts.constants';
import { RegisterForm, RegisterUser } from '~/accounts/authentication/register-form.component';
import { render, screen, userEvent, waitFor } from '~/test/utils';

const requiredMessages = {
  email: EMAIL_REQUIRED_MESSAGE,
  password: PASSWORD_REQUIRED_MESSAGE,
  confirmPassword: CONFIRM_PASSWORD_REQUIRED_MESSAGE,
  firstName: FIRST_NAME_REQUIRED_MESSAGE,
  lastName: LAST_NAME_REQUIRED_MESSAGE,
};

let registerUser: RegisterUser;

describe('Register Form', () => {
  beforeEach(() => {
    registerUser = vi.fn();
  });

  it('should successfully register user', async () => {
    render(<RegisterForm error={null} registerUser={registerUser} />);

    const email = 'test@email.com';
    const password = '123456';
    const confirmPassword = '123456';
    const firstName = 'John';
    const lastName = 'Smith';

    await userEvent.type(screen.getByRole('textbox', { name: 'email' }), email);
    await userEvent.type(screen.getByLabelText('password'), password);
    await userEvent.type(screen.getByLabelText('confirmPassword'), confirmPassword);
    await userEvent.type(screen.getByLabelText('firstName'), firstName);
    await userEvent.type(screen.getByLabelText('lastName'), lastName);

    const submitButton = screen.getByRole('button', { name: 'Register' });
    expect(submitButton).toBeEnabled();

    userEvent.click(submitButton);

    const expected = {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
    };

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith(expected);
    });
  });

  it('should disable submit button if form is not dirty', () => {
    render(<RegisterForm error={null} registerUser={registerUser} />);

    expect(screen.getByRole('button', { name: 'Register' })).toBeDisabled();
  });

  it('should disable submit button if form is invalid', async () => {
    render(<RegisterForm error={null} registerUser={registerUser} />);

    const email = 'invalid email';
    const password = '123456';
    const confirmPassword = '123456';
    const firstName = 'John';
    const lastName = 'Smith';

    await userEvent.type(screen.getByRole('textbox', { name: 'email' }), email);
    await userEvent.type(screen.getByLabelText('password'), password);
    await userEvent.type(screen.getByLabelText('confirmPassword'), confirmPassword);
    await userEvent.type(screen.getByLabelText('firstName'), firstName);
    await userEvent.type(screen.getByLabelText('lastName'), lastName);

    expect(screen.getByRole('button', { name: 'Register' })).toBeDisabled();
    expect(screen.getByText(INVALID_EMAIL_MESSAGE)).toBeInTheDocument();
  });

  it.each(['email', 'password', 'confirmPassword', 'firstName', 'lastName'])(
    'should show error if %s field is empty',
    async name => {
      render(<RegisterForm error={null} registerUser={registerUser} />);

      const submitButton = screen.getByRole('button', { name: 'Register' });

      expect(submitButton).toBeDisabled();

      userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(requiredMessages[name])).toBeInTheDocument();
      });

      expect(registerUser).not.toHaveBeenCalled();
    },
  );

  it('should display error well if error is present', async () => {
    const message = 'test-error-message';

    render(<RegisterForm error={{ message }} registerUser={registerUser} />);

    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
