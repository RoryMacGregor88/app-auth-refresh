import { FC, ReactElement } from 'react';

import { ACCOUNT_CREATED_SUCCESS_MESSAGE } from '~/accounts/accounts.constants';
import { RegistrationFormType, useRegister } from '~/accounts/authentication/register.hook';
import { FormWrapper } from '~/components/forms/form-wrapper.component';
import { Loadmask } from '~/components/loadmask.component';
import { Well } from '~/components/well.component';

import { RegisterForm } from './register-form.component';

export const Register: FC = (): ReactElement => {
  const { isError, error, isLoading, data, mutate: register } = useRegister();

  const onRegister = (form: RegistrationFormType) => {
    register(form);
  };

  return isLoading ? (
    <Loadmask />
  ) : (
    <FormWrapper>
      {isError ? <Well message={String(error?.message)} status="error" /> : null}
      {data ? <Well message={ACCOUNT_CREATED_SUCCESS_MESSAGE} status="success" /> : null}

      <h1 className="offscreen">Register</h1>
      <RegisterForm registerUser={onRegister} />
    </FormWrapper>
  );
};
