/*eslint import/namespace: ["off"]*/
import { Dispatch } from 'react';

import { rest } from 'msw';
import { describe, expect, it } from 'vitest';

import { HTTP_OK, SERVER_ERROR, UNAUTHENTICATED_ERROR_MESSAGE, UNAUTHORIZED_ERROR } from '~/api/api.constants';
import { server } from '~/mocks/server';
import { act, renderHook, waitFor } from '~/test/utils';

import { useRefresh } from './refresh.hook';

const ACCOUNT_ENDPOINT = 'http://localhost:5000/api/accounts';
const REFRESH_ENDPOINT = `${ACCOUNT_ENDPOINT}/refresh`;

interface Result {
  id: number;
  error: Error;
  refetch: () => void;
  isError: boolean;
  isSuccess: boolean;
  data: Record<string, unknown>;
  status: string;
}

let setAccessToken: Dispatch<string | null>;

describe('useRefresh', () => {
  beforeEach(() => {
    setAccessToken = vi.fn();
  });

  it('should logout if response is unauthorized', async () => {
    server.use(
      rest.get(REFRESH_ENDPOINT, (req, res, ctx) => {
        /** refresh endpoint returns 401 unauthorized status */
        return res(ctx.status(UNAUTHORIZED_ERROR), ctx.json({}));
      }),
    );

    server.use(
      rest.get(ACCOUNT_ENDPOINT, (req, res, ctx) => {
        /** logout endpoint returns successful logout */
        return res(ctx.status(HTTP_OK), ctx.json({}));
      }),
    );

    const { result } = renderHook<Result, unknown>(() => useRefresh(), { authInitialState: { setAccessToken } });

    const { refetch: refresh } = result.current;

    await act(() => refresh());

    await waitFor(() => {
      /** logout hook calls setAccessToken with null if successful */
      expect(setAccessToken).toHaveBeenCalledWith(null);
    });
  });

  // TODO: loop this like the others
  it('should reject promise for other error responses', async () => {
    server.use(rest.get(REFRESH_ENDPOINT, (req, res, ctx) => res(ctx.status(SERVER_ERROR), ctx.json({}))));

    const { result } = renderHook<Result, unknown>(() => useRefresh());

    await act(() => result.current.refetch());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error.message).toEqual(UNAUTHENTICATED_ERROR_MESSAGE);
  });

  it('should make successful request', async () => {
    const response = { accessToken: '123' };

    server.use(rest.get(REFRESH_ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_OK), ctx.json(response))));

    const { result } = renderHook<Result, unknown>(() => useRefresh(), { authInitialState: { setAccessToken } });

    await act(() => result.current.refetch());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const accessToken = result.current.data.accessToken;

    expect(setAccessToken).toHaveBeenCalledWith(accessToken);
    expect(accessToken).toEqual(response.accessToken);
  });
});
