import { FC, ReactElement, useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { useUser } from '~/accounts/users/user.hook';
import { FormWrapper } from '~/components/forms/form-wrapper.component';
import { Loadmask } from '~/components/loadmask.component';
import { Well } from '~/components/well.component';

import { LoginForm } from './login-form.component';
import { LoginFormType, useLogin } from './login.hook';

export const Login: FC = (): ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isError: isLoginError, error: loginError, isLoading: isLoginLoading, mutate: login } = useLogin();

  const { isError: isUserError, error: userError, data: user, isLoading: isUserLoading } = useUser();

  useEffect(() => {
    if (user) {
      const from = location.state?.from.pathname ?? '/';
      navigate(from, { replace: true });
    }
  }, [location, navigate, user]);

  const onLogin = (form: LoginFormType) => {
    login(form);
  };

  return isLoginLoading || isUserLoading ? (
    <Loadmask />
  ) : (
    <FormWrapper>
      {isLoginError ? <Well message={String(loginError.message)} /> : null}
      {isUserError ? <Well message={String(userError.message)} /> : null}
      <h1 className="offscreen">Login</h1>
      <LoginForm loginUser={onLogin} />
    </FormWrapper>
  );
};
