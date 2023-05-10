/*eslint import/namespace: ["off"]*/
import { describe, expect, it } from 'vitest';

import { HTTP_BAD_REQUEST, HTTP_FORBIDDEN, HTTP_OK, SERVER_ERROR } from '~/api/api.constants';
import { rest, server } from '~/mocks/server';
import { act, renderHook, waitFor } from '~/test/utils';

import { RegistrationFormType, useRegister } from './register.hook';

const ENDPOINT = 'http://localhost:5000/api/accounts/register/';

interface Result {
  id: number;
  error?: { message: string };
  mutate: (form: Record<string, unknown>) => void;
  isError: boolean;
  isSuccess: boolean;
  data?: Record<string, unknown>;
  status: string;
}

describe('useRegister', () => {
  it('should throw an error if any fields are missing', async () => {
    server.use(rest.post(ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_BAD_REQUEST), ctx.json({}))));

    const registerForm: Partial<RegistrationFormType> = {
      email: 'bob@example.com',
      lastName: 'Ross',
      password: 'otherpassword',
      confirmPassword: 'otherpassword',
    };

    const { result } = renderHook<Result, RegistrationFormType>(() => useRegister());

    act(() => result.current.mutate(registerForm));

    await waitFor(() => expect(result.current.isError).toBe(true));

    const validationError = {
      errors: [
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['firstName'],
          message: 'Required',
        },
      ],
    };

    expect(result.current.error).toEqual(expect.objectContaining(validationError));
  });

  it.each([
    { status: SERVER_ERROR, message: 'Server error' },
    { status: HTTP_FORBIDDEN, message: 'Forbidden error' },
    { status: HTTP_BAD_REQUEST, message: 'Bad request error' },
  ])('should reject promise for %s error responses', async ({ status, message }) => {
    server.use(rest.post(ENDPOINT, (req, res, ctx) => res(ctx.status(status), ctx.json({ message }))));

    const registerForm: RegistrationFormType = {
      email: 'bob@example.com',
      firstName: 'Bob',
      lastName: 'Ross',
      password: 'otherpassword',
      confirmPassword: 'otherpassword',
    };

    const { result } = renderHook<Result, RegistrationFormType>(() => useRegister());

    act(() => result.current.mutate(registerForm));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toStrictEqual({ message });
  });

  it('should return user id if registration successful', async () => {
    const response = { id: 1 };

    server.use(rest.post(ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_OK), ctx.json(response))));

    const registerForm: RegistrationFormType = {
      email: 'bob@example.com',
      firstName: 'Bob',
      lastName: 'Ross',
      password: 'mypassword',
      confirmPassword: 'mypassword',
    };

    const { result } = renderHook<Result, RegistrationFormType>(() => useRegister());

    act(() => result.current.mutate(registerForm));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toStrictEqual(response);
  });
});
