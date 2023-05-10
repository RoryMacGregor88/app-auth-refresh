import { FC, ReactElement } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  EMAIL_REQUIRED_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from '~/accounts/accounts.constants';
import { FieldError } from '~/components/forms/field-error.component';
import { SubmitButton } from '~/components/forms/submit-button.component';

import { LoginFormType } from './login.hook';
import { MandatoryField } from './register-form.component';

export type LoginUser = (form: LoginFormType) => void;
interface FormProps {
  loginUser: LoginUser;
}

const EMAIL_ID = 'email';
const PASSWORD_ID = 'password';

const LoginFormSchema = z.object({
  [EMAIL_ID]: z.string().min(1, { message: EMAIL_REQUIRED_MESSAGE }).email({ message: INVALID_EMAIL_MESSAGE }),
  [PASSWORD_ID]: z.string().min(1, { message: PASSWORD_REQUIRED_MESSAGE }),
});

const defaultFormValues = {
  [EMAIL_ID]: '',
  [PASSWORD_ID]: '',
};

export const LoginForm: FC<FormProps> = ({ loginUser }): ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: defaultFormValues,
    mode: 'all',
  });

  const onSubmit: SubmitHandler<LoginFormType> = form => loginUser(form);

  const isDisabled = !!Object.keys(errors).length || isSubmitting || !isDirty;

  return (
    <form className="flex flex-col p-8" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor={EMAIL_ID}>
        Email <MandatoryField />:
      </label>
      <div>
        <input id={EMAIL_ID} type={EMAIL_ID} {...register(EMAIL_ID)} className="form-input" disabled={isSubmitting} />
        {errors[EMAIL_ID] ? <FieldError>{errors[EMAIL_ID].message}</FieldError> : null}
      </div>

      <label htmlFor={PASSWORD_ID}>
        Password <MandatoryField />:
      </label>
      <div>
        <input
          id={PASSWORD_ID}
          type={PASSWORD_ID}
          {...register(PASSWORD_ID)}
          className="form-input"
          data-testid={PASSWORD_ID}
          disabled={isSubmitting}
        />
        {errors[PASSWORD_ID] ? <FieldError>{errors[PASSWORD_ID].message}</FieldError> : null}
      </div>

      <div className="flex justify-end p-2">
        <SubmitButton isDisabled={isDisabled}>Login</SubmitButton>
      </div>
    </form>
  );
};
