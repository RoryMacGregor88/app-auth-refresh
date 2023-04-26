import { FC, ReactElement, useEffect } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { useLocation, useNavigate } from 'react-router-dom';

import { useUser } from '~/accounts/users/user.hook';
import { ErrorFallback, errorHandler } from '~/components/error-fallback.component';
import { FormWrapper } from '~/components/forms/form-wrapper.component';
import { useCreateErrorReport } from '~/error-reporting/error-report.hook';

import { LoginForm } from './login-form.component';
import { LoginFormType, useLogin } from './login.hook';

const HOME_URL = '/';
const LOGIN_URL = '/login';

export const Login: FC = (): ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    mutate: login,
    data: userInfo,
    error: loginError,
    isError: isLoginError,
    isLoading: isLoginLoading,
  } = useLogin();
  const {
    data: user,
    error: userError,
    isError: isUserError,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess,
  } = useUser();

  useEffect(() => {
    if (user) {
      const from = location.state?.from.pathname ?? '/';
      navigate(from, { replace: true });
    }
  }, [location, navigate, user]);

  const onLogin = (form: LoginFormType) => {
    login(form);
  };

  return (
    <FormWrapper>
      <>
        <h1 className="offscreen">Login</h1>
        <LoginForm loginUser={onLogin} />
      </>
    </FormWrapper>
  );
};
