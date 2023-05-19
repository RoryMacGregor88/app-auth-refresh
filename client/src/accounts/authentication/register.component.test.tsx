/*eslint import/namespace: ["off"]*/
import { describe, expect, it, vi } from 'vitest';

import {
  EMAIL_REQUIRED_MESSAGE,
  FIRST_NAME_REQUIRED_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  LAST_NAME_REQUIRED_MESSAGE,
  PASSWORDS_NEED_TO_MATCH_MESSAGE,
  PASSWORD_CONFIRM_REQUIRED_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from '~/accounts/accounts.constants';
import { RegisterForm, RegisterUser } from '~/accounts/authentication/register-form.component';
import { render, screen, userEvent, waitFor } from '~/test/test-renderers';

let registerUser: RegisterUser;

describe('RegisterForm', () => {
  beforeEach(() => {
    registerUser = vi.fn();
  });

  it('should disable submit button if form is not dirty', () => {
    render(<RegisterForm registerUser={registerUser} />);

    expect(screen.getByRole('button', { name: 'Register' })).toBeDisabled();
  });

  it('should disable submit button if form is invalid', async () => {
    render(<RegisterForm registerUser={registerUser} />);

    const email = 'invalid email';
    const password = '123456';
    const confirmPassword = '123456';
    const firstName = 'John';
    const lastName = 'Smith';

    await userEvent.type(screen.getByRole('textbox', { name: 'Email * :' }), email);
    await userEvent.type(screen.getByLabelText('Password *:'), password);
    await userEvent.type(screen.getByLabelText('Password Confirmation *:'), confirmPassword);
    await userEvent.type(screen.getByRole('textbox', { name: 'First Name * :' }), firstName);
    await userEvent.type(screen.getByRole('textbox', { name: 'Last Name * :' }), lastName);

    expect(screen.getByRole('button', { name: 'Register' })).toBeDisabled();
    expect(screen.getByText(INVALID_EMAIL_MESSAGE)).toBeInTheDocument();
  });

  it('should show error if email is empty', async () => {
    render(<RegisterForm registerUser={registerUser} />);

    const password = '123456';
    const confirmPassword = '123456';
    const firstName = 'John';
    const lastName = 'Smith';

    await userEvent.type(screen.getByLabelText('Password *:'), password);
    await userEvent.type(screen.getByLabelText('Password Confirmation *:'), confirmPassword);
    await userEvent.type(screen.getByRole('textbox', { name: 'First Name * :' }), firstName);
    await userEvent.type(screen.getByRole('textbox', { name: 'Last Name * :' }), lastName);

    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText(EMAIL_REQUIRED_MESSAGE)).toBeInTheDocument();
    });

    expect(registerUser).not.toHaveBeenCalled();
  });

  it('should show error if password is empty', async () => {
    render(<RegisterForm registerUser={registerUser} />);

    const email = 'test@email.com';
    const firstName = 'John';
    const lastName = 'Smith';

    await userEvent.type(screen.getByRole('textbox', { name: 'Email * :' }), email);
    await userEvent.type(screen.getByRole('textbox', { name: 'First Name * :' }), firstName);
    await userEvent.type(screen.getByRole('textbox', { name: 'Last Name * :' }), lastName);

    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText(PASSWORD_REQUIRED_MESSAGE)).toBeInTheDocument();
    });

    expect(registerUser).not.toHaveBeenCalled();
  });

  it('should show error if confirm password is empty', async () => {
    render(<RegisterForm registerUser={registerUser} />);

    const email = 'test@email.com';
    const password = '123456';
    const firstName = 'John';
    const lastName = 'Smith';

    await userEvent.type(screen.getByRole('textbox', { name: 'Email * :' }), email);
    await userEvent.type(screen.getByLabelText('Password *:'), password);
    await userEvent.type(screen.getByRole('textbox', { name: 'First Name * :' }), firstName);
    await userEvent.type(screen.getByRole('textbox', { name: 'Last Name * :' }), lastName);

    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText(PASSWORD_CONFIRM_REQUIRED_MESSAGE)).toBeInTheDocument();
    });

    expect(registerUser).not.toHaveBeenCalled();
  });

  it('should show error if first name is empty', async () => {
    render(<RegisterForm registerUser={registerUser} />);

    const email = 'test@email.com';
    const password = '123456';
    const confirmPassword = '123456';
    const lastName = 'Smith';

    await userEvent.type(screen.getByRole('textbox', { name: 'Email * :' }), email);
    await userEvent.type(screen.getByLabelText('Password *:'), password);
    await userEvent.type(screen.getByLabelText('Password Confirmation *:'), confirmPassword);
    await userEvent.type(screen.getByRole('textbox', { name: 'Last Name * :' }), lastName);

    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText(FIRST_NAME_REQUIRED_MESSAGE)).toBeInTheDocument();
    });

    expect(registerUser).not.toHaveBeenCalled();
  });

  it('should show error if last name is empty', async () => {
    render(<RegisterForm registerUser={registerUser} />);

    const email = 'test@email.com';
    const password = '123456';
    const confirmPassword = '123456';
    const firstName = 'Smith';

    await userEvent.type(screen.getByRole('textbox', { name: 'Email * :' }), email);
    await userEvent.type(screen.getByLabelText('Password *:'), password);
    await userEvent.type(screen.getByLabelText('Password Confirmation *:'), confirmPassword);
    await userEvent.type(screen.getByRole('textbox', { name: 'First Name * :' }), firstName);

    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText(LAST_NAME_REQUIRED_MESSAGE)).toBeInTheDocument();
    });

    expect(registerUser).not.toHaveBeenCalled();
  });

  it('should show an error if password confirm does not match', async () => {
    render(<RegisterForm registerUser={registerUser} />);

    const password = 'password123';
    const confirmPassword = 'password456';

    await userEvent.type(screen.getByLabelText('Password *:'), password);
    await userEvent.type(screen.getByLabelText('Password Confirmation *:'), confirmPassword);

    await waitFor(() => {
      expect(screen.getByText(PASSWORDS_NEED_TO_MATCH_MESSAGE)).toBeInTheDocument();
    });
  });

  it('should successfully register user', async () => {
    render(<RegisterForm registerUser={registerUser} />);

    const email = 'test@email.com';
    const password = '123456';
    const confirmPassword = '123456';
    const firstName = 'John';
    const lastName = 'Smith';

    await userEvent.type(screen.getByRole('textbox', { name: 'Email * :' }), email);
    await userEvent.type(screen.getByLabelText('Password *:'), password);
    await userEvent.type(screen.getByLabelText('Password Confirmation *:'), confirmPassword);
    await userEvent.type(screen.getByRole('textbox', { name: 'First Name * :' }), firstName);
    await userEvent.type(screen.getByRole('textbox', { name: 'Last Name * :' }), lastName);

    const submitButton = screen.getByRole('button', { name: 'Register' });
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

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
});
