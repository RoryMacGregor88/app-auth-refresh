/*eslint import/namespace: ["off"]*/
import { rest } from 'msw';
import { describe, expect, it } from 'vitest';

import { HTTP_OK, SERVER_ERROR } from '~/api/api.constants';
import { server } from '~/mocks/server';
import { act, renderHook, waitFor } from '~/test/test-renderers';

import { useUser } from './user.hook';

const TEST_USER_ID = 'test-user-id';
const TEST_ACCESS_TOKEN = 'test-access-token';
const ENDPOINT = `http://localhost:5000/api/users/${TEST_USER_ID}`;

const testUser = {
  _id: '123',
  email: 'email@example.com',
  password: '12345',
  refreshTokens: ['123', '456'],
  roles: [123, 456],
};

interface Result {
  id: number;
  error: Error;
  mutate: (form: Record<string, unknown>) => void;
  isError: boolean;
  isSuccess: boolean;
  data?: Record<string, unknown>;
  status: string;
}

describe('useUser', () => {
  it('should not fire queryFn if user id not present in state', async () => {
    server.use(rest.get(ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_OK), ctx.json(testUser))));

    const { result } = await renderHook<Result, unknown>(() => useUser(), {
      authInitialState: {
        userId: undefined,
        accessToken: TEST_ACCESS_TOKEN,
      },
    });

    await act(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
  });

  it('should not fire queryFn if access token not present in state', async () => {
    server.use(rest.get(ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_OK), ctx.json(testUser))));

    const { result } = await renderHook<Result, unknown>(() => useUser(), {
      authInitialState: {
        userId: TEST_USER_ID,
        accessToken: undefined,
      },
    });

    await act(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
  });

  it('should set isError true and populate error property', async () => {
    const error = { message: 'test-error-message' };

    server.use(rest.get(ENDPOINT, (req, res, ctx) => res(ctx.status(SERVER_ERROR), ctx.json(error))));

    const { result } = await renderHook<Result, unknown>(() => useUser(), {
      authInitialState: {
        userId: TEST_USER_ID,
        accessToken: TEST_ACCESS_TOKEN,
      },
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.error.message).toEqual(error.message);
    });
  });

  it('should return user data', async () => {
    server.use(rest.get(ENDPOINT, (req, res, ctx) => res(ctx.status(HTTP_OK), ctx.json(testUser))));

    const { result } = await renderHook<Result, unknown>(() => useUser(), {
      authInitialState: {
        userId: TEST_USER_ID,
        accessToken: TEST_ACCESS_TOKEN,
      },
    });

    await act(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(testUser);
  });
});
