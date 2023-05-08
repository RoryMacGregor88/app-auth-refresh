/*eslint import/namespace: ["off"]*/
import { describe, expect, it } from 'vitest';

import { HTTP_BAD_REQUEST, HTTP_OK } from '~/api/api.constants';
import { rest, server } from '~/mocks/server';
import { act, renderHook, waitFor } from '~/test/utils';

import { RegistrationFormType, useRegister } from './register.hook';

const ENDPOINT = '*/api/accounts/register/';

interface Result {
  id: number;
  error?: { message: string };
  mutate: (form: Record<string, unknown>) => void;
  isError: boolean;
  isSuccess: boolean;
  data?: Record<string, unknown>;
  status: string;
}

describe('useRegisterHook', () => {
  it('should throw an error if any fields are missing', async () => {
    const expectedMessage = 'Please re-authenticate';
    server.use(
      rest.post(ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_BAD_REQUEST), ctx.json({ message: expectedMessage }))),
    );

    const registerForm: RegistrationFormType = {
      email: 'bob@example.com',
      firstName: 'Bob',
      lastName: 'Ross',
      password: 'otherpassword',
      confirmPassword: 'otherpassword',
    };

    const { result } = renderHook<Result, RegistrationFormType>(() => useRegister());

    act(() => result.current.mutate(registerForm));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toStrictEqual({ message: expectedMessage });
  });

  it('should throw an error if email is malformed', async () => {
    const expectedMessage = 'Please re-authenticate';
    server.use(
      rest.post(ENDPOINT, (req, res, ctx) =>
        res(ctx.status(HTTP_BAD_REQUEST), ctx.json({ error: { message: expectedMessage } })),
      ),
    );

    const registerForm: RegistrationFormType = {
      email: 'bob@example',
      firstName: 'Bob',
      lastName: 'Ross',
      password: 'otherpassword',
      confirmPassword: 'otherpassword',
    };
    const { result } = renderHook<Result, RegistrationFormType>(() => useRegister());

    act(() => {
      result.current.mutate(registerForm);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error).toStrictEqual({ message: expectedMessage });
  });

  it('should throw an error if email has already been registered', async () => {
    const expectedMessage = 'Please re-authenticate';
    server.use(
      rest.post(ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_BAD_REQUEST), ctx.json({ message: expectedMessage }))),
    );

    const registerForm: RegistrationFormType = {
      email: 'bob@example.com',
      firstName: 'Bob',
      lastName: 'Ross',
      password: 'notreallybob',
      confirmPassword: 'notreallybob',
    };
    const { result } = renderHook<Result, RegistrationFormType>(() => useRegister());

    act(() => {
      result.current.mutate(registerForm);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toStrictEqual({ message: expectedMessage });
  });

  it('should show success code if registration was successful', async () => {
    const expectedResponse = { id: 1 };
    server.use(rest.post(ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_OK), ctx.json(expectedResponse))));

    const registerForm: RegistrationFormType = {
      email: 'bob@example.com',
      firstName: 'Bob',
      lastName: 'Ross',
      password: 'mypassword',
      confirmPassword: 'mypassword',
    };
    const { result } = renderHook<Result, RegistrationFormType>(() => useRegister());

    act(() => {
      result.current.mutate(registerForm);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.status).toBe('success');
    expect(result.current.data).toBe(1); // returns an id
  });
});
