/*eslint import/namespace: ["off"]*/
import { rest } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '~/mocks/server';
import { act, renderHook, waitFor } from '~/test/utils';

import { ErrorReport, useCreateErrorReport } from './error-report.hook';

interface Result {
  isSuccess: boolean;
  data: ErrorReport;
  mutate: (report: ErrorReport) => void;
}

describe('useErrorReport', () => {
  it('should successfully post data to the server', async () => {
    const report = { message: 'Test Message', stackTrace: 'Test Stack Trace' };

    server.use(
      rest.post('*/api/error/report', (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 1, ...report }))),
    );

    const { result } = renderHook<Result, ErrorReport>(() => useCreateErrorReport());

    await act(() => result.current.mutate(report));

    await waitFor(() => expect(result.current.data).toEqual({ id: 1, ...report }));
  });
});
