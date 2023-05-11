import { FC, ReactElement, useState } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

import { useAuthentication } from '~/accounts/authentication/authentication.hook';
import { useLogout } from '~/accounts/authentication/logout.hook';
import { ErrorFallback, errorHandler } from '~/components/error-fallback.component';
import { useCreateErrorReport } from '~/error-reporting/error-report.hook';
import { LanguageSwitcher } from '~/i18n/language-switcher.component';
import { ThemeSwitcher } from '~/theme/theme-switcher.component';

const Bomb = () => {
  throw new Error('💥 BADABOOM 💥');
};

export const Header: FC = (): ReactElement => {
  const { mutate, data: report, error: failure, isError, isSuccess } = useCreateErrorReport();

  const { t } = useTranslation();
  const { user } = useAuthentication();
  const { refetch: logout } = useLogout();

  const [explode, setExplode] = useState(false);

  const handleErrorReport = (error: Error) => {
    const sendErrorReport = async () => {
      await mutate({ message: error.message, stackTrace: error.stack ?? '' });
    };

    sendErrorReport();
  };

  return (
    <header className="header flex justify-between p-10">
      {user ? (
        <>
          <h1 className="font-bold">
            {t('greeting')} {user.name}
          </h1>
          <button onClick={() => logout()}>Logout</button>
        </>
      ) : (
        <h1 className="font-bold">{t('greeting')}</h1>
      )}

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
        <span className="flex items-center justify-between">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </span>
      </ErrorBoundary>
    </header>
  );
};
