/*eslint import/namespace: ["off"]*/
import { Dispatch } from 'react';

import { describe, expect, it } from 'vitest';

import { useLogout } from '~/accounts/authentication/logout.hook';
import { HTTP_BAD_REQUEST, HTTP_FORBIDDEN, HTTP_OK, SERVER_ERROR } from '~/api/api.constants';
import { rest, server } from '~/mocks/server';
import { act, renderHook, waitFor } from '~/test/test-renderers';

import { User } from './authentication.context';

const ENDPOINT = '*/api/accounts/';

interface Result {
  isSuccess: boolean;
  isError: boolean;
  data: Record<string, unknown>;
  refetch: () => void;
  error: Error;
  current: Record<string, unknown>;
}

let setAccessToken: Dispatch<string | null>;
let setUserId: Dispatch<string | null>;
let setUser: Dispatch<User | null>;

describe('useLogout', () => {
  beforeEach(() => {
    setAccessToken = vi.fn();
    setUserId = vi.fn();
    setUser = vi.fn();
  });

  it.each([
    { status: SERVER_ERROR, message: 'Server error' },
    { status: HTTP_FORBIDDEN, message: 'Forbidden error' },
    { status: HTTP_BAD_REQUEST, message: 'Bad request error' },
  ])('should reject promise for %s error responses', async ({ status, message }) => {
    const error = { message };

    server.use(rest.get(ENDPOINT, (req, res, ctx) => res(ctx.status(status), ctx.json(error))));

    const { result } = renderHook<Result, unknown>(() => useLogout(), {
      authInitialState: { setAccessToken, setUserId, setUser },
    });

    await act(() => result.current.refetch());

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error.message).toBe(message);

    expect(setUser).not.toHaveBeenCalled();
    expect(setUserId).not.toHaveBeenCalled();
    expect(setAccessToken).not.toHaveBeenCalled();
  });

  it('should successfully log out user', async () => {
    const { result } = renderHook<Result, unknown>(() => useLogout(), {
      authInitialState: { setAccessToken, setUserId, setUser },
    });

    server.use(rest.get(ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_OK), ctx.json({}))));

    await act(() => result.current.refetch());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setUser).toHaveBeenCalledWith(null);
    expect(setUserId).toHaveBeenCalledWith(null);
    expect(setAccessToken).toHaveBeenCalledWith(null);
  });
});
