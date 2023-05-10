import { FC, ReactElement, useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { useUser } from '~/accounts/users/user.hook';
import { FormWrapper } from '~/components/forms/form-wrapper.component';
import { Well } from '~/components/well.component';

import { LoginForm } from './login-form.component';
import { LoginFormType, useLogin } from './login.hook';

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
      {isLoginError ? <Well message={String(loginError)} /> : null}
      <h1 className="offscreen">Login</h1>
      <LoginForm loginUser={onLogin} />
    </FormWrapper>
  );
};
