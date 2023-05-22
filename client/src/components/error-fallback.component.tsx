import { FC, ReactElement } from 'react';

import { ErrorReport } from '../error-reporting/error-report.hook';

interface ErrorFallbackProps {
  /**
   * Standard error object. Required. This should have a message
   */
  error: Error;
  /**
   * Reset Error Boundary method. This clears the error message
   */
  resetErrorBoundary: () => void;
  /**
   * Handle Error Report. This should hit an endpoint with an error report
   */
  handleErrorReport: (error: Error) => void;
  /**
   * Error report object.
   */
  report: ErrorReport | undefined;
  /**
   * Error thrown by API if we fail to submit
   */
  failure: Error;
  /**
   * This should be true if there was an issue with submitting
   * the error report to the API endpoint
   */
  isError: boolean;
  /**
   * Boolean which is true if the report was submitted successfully
   */
  isSuccess: boolean;
}

export const errorHandler = (error: Error, info: { componentStack: string }) => {
  console.log('ERROR inside errorHandler: ', error);
  console.log('INFO inside errorHandler: ', info);
};

export const ErrorFallback: FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  handleErrorReport,
  report,
  failure,
  isError,
  isSuccess,
}): ReactElement => (
  <div className="rounded-md border-2 border-gray-700 bg-gray-300 p-4 text-black">
    <p>Something went wrong</p>

    <div className="p-4">
      <pre>{error.message}</pre>

      <details>
        <summary className="my-2 font-bold">Expand for details...</summary>

        <pre>{error.stack}</pre>
      </details>
    </div>

    <div>
      <button
        className="mr-1 rounded-md border-2 border-black bg-blue-500 px-4 py-2 text-white disabled:opacity-25"
        disabled={isSuccess}
        onClick={() => handleErrorReport(error)}
      >
        Submit Error Report
      </button>

      <button
        className="rounded-md border-2 border-black bg-green-500 px-4 py-2 text-white"
        onClick={resetErrorBoundary}
      >
        Try to recover
      </button>
    </div>

    {isError ? (
      <div>
        <p>Unable to send error report:</p>
        <p>{failure?.message}</p>
      </div>
    ) : null}

    {isSuccess ? (
      <div className="p-4">
        Details sent, thank you. Your ticket reference is: <span className="font-bold">{report?.id}</span>
      </div>
    ) : null}
  </div>
);
