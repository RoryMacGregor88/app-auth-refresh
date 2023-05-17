import { rest } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '~/mocks/server';
import { renderHook, waitFor } from '~/test/test-renderers';

import { AppConfig, useAppConfig } from './app-config.hook';

interface Result {
  isSuccess: boolean;
  data: AppConfig;
}

describe('useAppConfig', () => {
  it('should fetch data to configure the frontend', async () => {
    const config = { name: 'Test Name' };

    server.use(rest.get('*/api/app/config', (req, res, ctx) => res(ctx.status(200), ctx.json(config))));

    const { result } = renderHook<Result, unknown>(() => useAppConfig());

    await waitFor(() => expect(result.current.data).toEqual(config));
  });
});
