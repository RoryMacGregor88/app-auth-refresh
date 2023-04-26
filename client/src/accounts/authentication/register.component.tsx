import { FC, ReactElement } from 'react';

import { FormWrapper } from '~/components/forms/form-wrapper.component';

import { RegisterForm } from './register-form.component';
import { RegistrationFormType, useRegister } from './register.hook';

export const Register: FC = (): ReactElement => {
  const { mutate: register, isError, isLoading } = useRegister();

  const onRegister = (form: RegistrationFormType) => {
    register(form);
  };

  if (isLoading) {
    return <p>Registering User</p>;
  }

  if (isError) {
    return <p>There is a register error</p>;
  }

  return (
    <FormWrapper>
      <>
        <h1 className="offscreen">Register</h1>
        <RegisterForm registerUser={onRegister} />
      </>
    </FormWrapper>
  );
};
