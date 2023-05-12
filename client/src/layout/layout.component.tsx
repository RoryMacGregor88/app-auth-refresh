import { FC, ReactElement, useState } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';

import { ErrorFallback, errorHandler } from '~/components/error-fallback.component';
import { useCreateErrorReport } from '~/error-reporting/error-report.hook';
import { Footer } from '~/layout/footer.component';
import { Header } from '~/layout/header.component';

const Bomb = () => {
  throw new Error('💥 CABOOM 💥');
};

export const Layout: FC = (): ReactElement => {
  const { mutate, data: report, error: failure, isError, isSuccess } = useCreateErrorReport();

  const [explode, setExplode] = useState(false);

  const handleErrorReport = (error: Error) => {
    const sendErrorReport = async () => {
      await mutate({ message: error.message, stackTrace: error.stack ?? '' });
    };

    sendErrorReport();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="grow">
        <button onClick={() => setExplode(e => !e)}>toggle explode</button>

        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorFallback
              error={error}
              failure={failure}
              handleErrorReport={handleErrorReport}
              isError={isError}
              isSuccess={isSuccess}
              report={report}
              resetErrorBoundary={resetErrorBoundary}
            />
          )}
          resetKeys={[explode]}
          onError={errorHandler}
          onReset={() => setExplode(false)}
        >
          {explode ? <Bomb /> : null}
          <Outlet />
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
};
