import { FC, ReactElement } from 'react';

import { ErrorReport } from '~/error-reporting/error-report.hook';

interface Props {
  error: Error;
  resetErrorBoundary: () => void;
  handleErrorReport: (error: Error) => void;
  report: ErrorReport | undefined;
  failure: unknown;
  isError: boolean;
  isSuccess: boolean;
}

export const errorHandler = (error: Error, info: { componentStack: string }) => {
  console.log('ERROR inside errorHandler: ', error);
  console.log('INFO inside errorHandler: ', info);
};

export const ErrorFallback: FC<Props> = ({
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
        className="mr-1 rounded-md border-2 border-black bg-blue-500 py-2 px-4 text-white disabled:opacity-25"
        disabled={isSuccess}
        onClick={() => handleErrorReport(error)}
      >
        Submit Error Report
      </button>

      <button
        className="rounded-md border-2 border-black bg-green-500 py-2 px-4 text-white"
        onClick={resetErrorBoundary}
      >
        Try to recover
      </button>
    </div>

    {isError ? (
      <div>
        <p>Unable to send error report:</p>
        <p>{failure instanceof Error}</p>
      </div>
    ) : null}

    {isSuccess ? (
      <div className="p-4">
        Details sent, thank you. Your ticket reference is: <span className="font-bold">{report?.id}</span>
      </div>
    ) : null}
  </div>
);
