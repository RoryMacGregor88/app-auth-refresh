import { describe, expect, it } from 'vitest';

import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { render, screen, userEvent } from '~/test/test-renderers';
import { ErrorReport } from '~/error-reporting/error-report.hook';

import { ErrorFallback } from './error-fallback.component';

describe('ErrorFallback', () => {
  let user: UserEvent;

  let error: Error;
  let resetErrorBoundary: () => void;
  let handleErrorReport: (error: Error) => void;
  let report: ErrorReport | undefined;
  let failure: unknown;
  let isError: boolean;
  let isSuccess: boolean;

  beforeEach(() => {
    user = userEvent.setup();

    error = new Error('Test Error');
    resetErrorBoundary = vi.fn();
    handleErrorReport = vi.fn();
    report = undefined;
    failure = null;
    isError = false;
    isSuccess = false;
  });

  it('should render the ErrorFallback', () => {
    render(
      <ErrorFallback
        error={error}
        resetErrorBoundary={resetErrorBoundary}
        handleErrorReport={handleErrorReport}
        report={report}
        failure={failure}
        isError={isError}
        isSuccess={isSuccess}
      />,
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/^test error$/i)).toBeInTheDocument();
    expect(screen.getByText(/expand for details.../i)).toBeInTheDocument();
    expect(screen.getByText(/error: test error/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit error report/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try to recover/i })).toBeInTheDocument();
  });

  it('should submit error report when `Submit Error Report` button clicked', async () => {
    render(
      <ErrorFallback
        error={error}
        resetErrorBoundary={resetErrorBoundary}
        handleErrorReport={handleErrorReport}
        report={report}
        failure={failure}
        isError={isError}
        isSuccess={isSuccess}
      />,
    );

    await user.click(screen.getByRole('button', { name: /submit error report/i }));

    expect(handleErrorReport).toHaveBeenCalledWith(new Error('Test Error'));
  });
});
