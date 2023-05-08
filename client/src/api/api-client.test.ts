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
  it('should call refresh function and re-fetch if response is unauthorized', async () => {
    const responseData = { username: 'John Smith' };
    const message = 'test-error-message';
    const accessToken = '12345';

    let first = true;

    /** original endpoint */
    server.use(
      rest.post(ENDPOINT, async (req, res, ctx) => {
        if (first) {
          first = false;
          return res(ctx.status(UNAUTHORIZED_ERROR), ctx.json({ message }));
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

  it('should reject promise if refresh request fails', async () => {
    /** original endpoint */
    server.use(rest.post(ENDPOINT, async (req, res, ctx) => res(ctx.status(UNAUTHORIZED_ERROR), ctx.json({}))));

    /** refresh endpoint when original request is unauthorized */
    server.use(rest.get(REFRESH_ENDPOINT, (req, res, ctx) => res(ctx.status(SERVER_ERROR), ctx.json({}))));

    const { result } = renderHook(() => useApiClient());

    const asyncCallback = result.current as (endpoint: string) => Promise<string>;

    try {
      await asyncCallback(ENDPOINT);
    } catch (error) {
      expect(error).toEqual(UNAUTHENTICATED_ERROR_MESSAGE);
    }
  });

  it.each([SERVER_ERROR, HTTP_FORBIDDEN, HTTP_BAD_REQUEST])(
    'should reject promise for %s error responses',
    async status => {
      const message = 'test-error-message';

      server.use(rest.post(ENDPOINT, (req, res, ctx) => res(ctx.status(status), ctx.json({ message }))));

      const { result } = renderHook(() => useApiClient());

      const asyncCallback = result.current as (endpoint: string) => Promise<void>;

      try {
        await asyncCallback(ENDPOINT);
      } catch (error) {
        expect(error).toEqual({ message });
      }
    },
  );

  it('should make a successful network request', async () => {
    const responseData = { username: 'John Smith' };

    server.use(rest.post(ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_OK), ctx.json(responseData))));

    const { result } = renderHook(() => useApiClient());

    const asyncCallback = result.current as (endpoint: string) => Promise<void>;

    const data = await asyncCallback(ENDPOINT);

    expect(data).toEqual(responseData);
  });
});
