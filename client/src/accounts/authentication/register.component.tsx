import { FC, ReactElement, useEffect, useState } from 'react';

import { FormWrapper } from '~/components/forms/form-wrapper.component';
import { ServerError } from '~/types';

import { RegisterForm } from './register-form.component';
import { RegistrationFormType, useRegister } from './register.hook';

export const Register: FC = (): ReactElement => {
  const { isError: isRegisterError, error: registerError, mutate: register } = useRegister();
  const [serverError, setServerError] = useState<ServerError | null>(null);

  const onRegister = (form: RegistrationFormType) => {
    register(form);
  };

  useEffect(() => {
    if (isRegisterError) {
      setServerError({ message: String(registerError) });
    }
  }, [isRegisterError, registerError]);

  return (
    <FormWrapper>
      <>
        <h1 className="offscreen">Register</h1>
        <RegisterForm error={serverError} registerUser={onRegister} />
      </>
    </FormWrapper>
  );
};
