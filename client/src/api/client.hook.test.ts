import { describe, expect, it } from 'vitest';

import { rest, server } from '~/mocks/server';
import { waitFor } from '~/test/utils';

import { api, apiClient, client } from './client';

describe('API Client', () => {
  const endpoint = '';
  const mockResult: Record<string, unknown> = {};

  // beforeEach(() => {
  //   endpoint = 'api/test';
  //   mockResult = { value: 'VALUE' };

  //   server.use(
  //     rest.get(`*/${endpoint}`, async (req, res, ctx) => {
  //       return res(ctx.json(mockResult));
  //     }),
  //   );
  // });

  describe.skip('api', () => {
    it('should test the GET function with no querystring', async () => {
      const response = await api.get(endpoint);

      expect(response).toEqual(mockResult);
    });

    it('should test the GET function with a querystring', async () => {
      const querystring = 'name=john&age=28&dob=2001-01-01T00:00:00';
      const response = await api.get(`${endpoint}?${querystring}`);

      expect(response).toEqual(mockResult);
    });

    it('should return an error response for the GET function', async () => {
      const mockError = { message: 'Test Error' };
      server.use(
        rest.get(`*/${endpoint}`, async (req, res, ctx) => {
          return res(ctx.status(401), ctx.json(mockError));
        }),
      );

      const response = await api.get(endpoint).catch(error => error);
      expect(response).toEqual(mockError);
    });
  });

  describe.skip('apiClient', () => {
    it('should test `apiClient`', async () => {
      const response = await apiClient(endpoint);

      expect(response).toEqual(mockResult);
    });
  });

  describe.skip('client', () => {
    it('should test `client`', async () => {
      const response = await client(endpoint);

      expect(response).toEqual(mockResult);
    });
  });
});
