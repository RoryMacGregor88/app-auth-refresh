/*eslint import/namespace: ["off"]*/
import { Dispatch } from 'react';

import { describe, expect, it } from 'vitest';

import { HTTP_BAD_REQUEST, HTTP_FORBIDDEN, HTTP_OK, SERVER_ERROR } from '~/api/api.constants';
import { rest, server } from '~/mocks/server';
import { act, renderHook, waitFor } from '~/test/utils';

import { UserConfigType, useLogin } from './login.hook';

const ENDPOINT = '*/api/accounts/';

interface Result {
  isSuccess: boolean;
  isError: boolean;
  data: Record<string, unknown>;
  mutate: (form: Record<string, unknown>) => void;
  error: Error;
  current: Record<string, unknown>;
}

let setAccessToken: Dispatch<string | null>;
let setUserId: Dispatch<string | null>;

describe('useLogin', () => {
  beforeEach(() => {
    setAccessToken = vi.fn();
    setUserId = vi.fn();
  });

  it.each([
    { status: SERVER_ERROR, message: 'Server error' },
    { status: HTTP_FORBIDDEN, message: 'Forbidden error' },
    { status: HTTP_BAD_REQUEST, message: 'Bad request error' },
  ])('should reject promise for %s error responses', async ({ status, message }) => {
    const loginForm = { email: 'john@example.com', password: 'otherpassword', accessToken: 'foobar' };

    server.use(rest.post(ENDPOINT, (req, res, ctx) => res(ctx.status(status), ctx.json(message))));

    const { result } = renderHook<Result, unknown>(() => useLogin(), {
      authInitialState: { setAccessToken, setUserId },
    });

    await act(() => result.current.mutate(loginForm));

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error.message).toStrictEqual(message);

    expect(setUserId).not.toHaveBeenCalled();
    expect(setAccessToken).not.toHaveBeenCalled();
  });

  it('should make a successful request', async () => {
    const loginData = { email: 'john@example.com', password: 'mypassword' };

    const { result } = renderHook<Result, unknown>(() => useLogin(), {
      authInitialState: { setAccessToken, setUserId },
    });

    const userConfig: UserConfigType = { accessToken: '123', id: '456' };

    server.use(rest.post(ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_OK), ctx.json(userConfig))));

    await act(() => result.current.mutate(loginData));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toStrictEqual(userConfig);

    expect(setUserId).toHaveBeenCalledWith(userConfig.id);
    expect(setAccessToken).toHaveBeenCalledWith(userConfig.accessToken);
  });
});
