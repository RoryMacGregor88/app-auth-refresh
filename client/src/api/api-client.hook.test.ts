/*eslint import/namespace: ["off"]*/
import { describe, expect, it } from 'vitest';

import {
  HTTP_BAD_REQUEST,
  HTTP_FORBIDDEN,
  HTTP_OK,
  SERVER_ERROR,
  UNAUTHENTICATED_ERROR_MESSAGE,
  UNAUTHORIZED_ERROR,
} from '~/api/api.constants';
import { rest, server } from '~/mocks/server';
import { act, renderHook, waitFor } from '~/test/utils';

import { useApiClient } from './api-client.hook';

const ENDPOINT = 'http://localhost:3000/test-endpoint';
const REFRESH_ENDPOINT = 'http://localhost:5000/api/accounts/refresh';

describe('useApiClient', () => {
  it.only('should reject promise if refresh request fails', async () => {
    const error = { message: 'test-error-message' };

    /** original endpoint */
    server.use(rest.post(ENDPOINT, async (req, res, ctx) => res(ctx.status(UNAUTHORIZED_ERROR), ctx.json(error))));

    /** refresh endpoint when original request is unauthorized */
    server.use(rest.get(REFRESH_ENDPOINT, (req, res, ctx) => res(ctx.status(SERVER_ERROR), ctx.json({}))));

    const { result } = renderHook(() => useApiClient());

    const asyncCallback = result.current as (endpoint: string) => Promise<Error>;

    try {
      await asyncCallback(ENDPOINT);
    } catch (e) {
      const error = e as Error;
      expect(error.message).toEqual(UNAUTHENTICATED_ERROR_MESSAGE);
    }
  });

  it.each([
    { status: SERVER_ERROR, message: 'Server error' },
    { status: HTTP_FORBIDDEN, message: 'Forbidden error' },
    { status: HTTP_BAD_REQUEST, message: 'Bad request error' },
  ])('should reject promise for %s error responses', async ({ status, message }) => {
    const error = { message };
    server.use(rest.post(ENDPOINT, (req, res, ctx) => res(ctx.status(status), ctx.json(error))));

    const { result } = renderHook(() => useApiClient());

    const asyncCallback = result.current as (endpoint: string) => Promise<Error>;

    try {
      await asyncCallback(ENDPOINT);
    } catch (e) {
      const error = e as Error;
      expect(error.message).toEqual(message);
    }
  });

  it('should call refresh function and re-fetch if response is unauthorized', async () => {
    const responseData = { username: 'John Smith' };
    const error = { message: 'test-error-message' };
    const accessToken = '12345';

    let first = true;

    /** original endpoint */
    server.use(
      rest.post(ENDPOINT, async (req, res, ctx) => {
        if (first) {
          first = false;
          return res(ctx.status(UNAUTHORIZED_ERROR), ctx.json(error));
        } else {
          return res(ctx.status(HTTP_OK), ctx.json(responseData));
        }
      }),
    );

    /** refresh endpoint when original request is unauthorized */
    server.use(rest.get(REFRESH_ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_OK), ctx.json({ accessToken }))));

    const { result } = renderHook(() => useApiClient());

    const asyncCallback = result.current as (endpoint: string) => Promise<{ name: string }>;

    let data: { name: string };
    await act(async () => {
      data = await asyncCallback(ENDPOINT);
    });

    await waitFor(() => {
      expect(data).toEqual(responseData);
    });
  });

  it('should make a successful network request', async () => {
    const responseData = { username: 'John Smith' };

    server.use(rest.post(ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_OK), ctx.json(responseData))));

    const { result } = renderHook(() => useApiClient());

    const asyncCallback = result.current as (endpoint: string) => Promise<void>;

    const data = await asyncCallback(ENDPOINT);

    expect(data).toEqual(responseData);
  });
});
