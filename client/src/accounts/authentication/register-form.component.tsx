import { FC, ReactElement } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  EMAIL_REQUIRED_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from '~/accounts/accounts.constants';
import { ErrorWell } from '~/components/error-well.component';
import { FieldError } from '~/components/forms/field-error.component';
import { SubmitButton } from '~/components/forms/submit-button.component';
import { ServerError } from '~/types';

import { RegistrationFormType } from './register.hook';

export const MandatoryField: FC = () => <span className="text-red-700">*</span>;

export type RegisterUser = (form: RegistrationFormType) => void;
interface FormProps {
  error: ServerError | null;
  registerUser: RegisterUser;
}

const EMAIL_ID = 'email';
const FIRST_NAME_ID = 'firstName';
const LAST_NAME_ID = 'lastName';
const PASSWORD_ID = 'password';
const PASSWORD_CONFIRM_ID = 'confirmPassword';

export const RegistrationFormSchema = z.object({
  [EMAIL_ID]: z.string({ required_error: EMAIL_REQUIRED_MESSAGE }).email({ message: INVALID_EMAIL_MESSAGE }),
  [FIRST_NAME_ID]: z.string(),
  [LAST_NAME_ID]: z.string(),
  [PASSWORD_ID]: z.string({ required_error: PASSWORD_REQUIRED_MESSAGE }),
  [PASSWORD_CONFIRM_ID]: z.string(),
});

const defaultFormValues = {
  [EMAIL_ID]: '',
  [PASSWORD_ID]: '',
  [PASSWORD_CONFIRM_ID]: '',
  [FIRST_NAME_ID]: '',
  [LAST_NAME_ID]: '',
};

export const RegisterForm: FC<FormProps> = ({ error, registerUser }): ReactElement => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RegistrationFormType>({
    resolver: zodResolver(RegistrationFormSchema),
    defaultValues: defaultFormValues,
  });

  console.log('getValues: ', getValues());
  console.log('errors: ', errors);

  const onSubmit: SubmitHandler<RegistrationFormType> = form => registerUser(form);

  const isDisabled = !!Object.keys(errors).length || isSubmitting || !isDirty;

  return (
    <div>
      {error ? <ErrorWell error={error} /> : null}
      <form className="flex flex-col p-8" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor={EMAIL_ID}>
          Email <MandatoryField />:
        </label>
        <div>
          <input
            type={EMAIL_ID}
            {...register(EMAIL_ID)}
            autoFocus
            required
            aria-label={EMAIL_ID}
            aria-required={true}
            className="form-input"
            disabled={isSubmitting}
          />

          {errors[EMAIL_ID] ? <FieldError>{errors[EMAIL_ID].message}</FieldError> : null}
        </div>

        <label htmlFor={PASSWORD_ID}>
          Password <MandatoryField />:
        </label>
        <div>
          <input
            type={PASSWORD_ID}
            {...register(PASSWORD_ID)}
            required
            aria-label={PASSWORD_ID}
            aria-required={true}
            className="form-input"
            disabled={isSubmitting}
          />

          {errors[PASSWORD_ID] ? <FieldError>{errors[PASSWORD_ID].message}</FieldError> : null}
        </div>

        <label htmlFor={PASSWORD_CONFIRM_ID}>
          Password Confirmation <MandatoryField />:
        </label>
        <div>
          <input
            type={PASSWORD_ID}
            {...register(PASSWORD_CONFIRM_ID)}
            required
            aria-label={PASSWORD_CONFIRM_ID}
            aria-required={true}
            className="form-input"
            disabled={isSubmitting}
          />

          {errors[PASSWORD_CONFIRM_ID] ? <FieldError>{errors[PASSWORD_CONFIRM_ID].message}</FieldError> : null}
        </div>

        <label htmlFor={FIRST_NAME_ID}>
          First Name <MandatoryField />:
        </label>
        <div>
          <input
            type="text"
            {...register(FIRST_NAME_ID)}
            autoFocus
            required
            aria-label={FIRST_NAME_ID}
            aria-required={true}
            className="form-input"
            disabled={isSubmitting}
          />

          {errors[FIRST_NAME_ID] ? <FieldError>{errors[FIRST_NAME_ID].message}</FieldError> : null}
        </div>

        <label htmlFor={LAST_NAME_ID}>
          Last Name <MandatoryField />:
        </label>
        <div>
          <input
            type="text"
            {...register(LAST_NAME_ID)}
            autoFocus
            required
            aria-label={LAST_NAME_ID}
            aria-required={true}
            className="form-input"
            disabled={isSubmitting}
          />

          {errors[LAST_NAME_ID] ? <FieldError>{errors[LAST_NAME_ID].message}</FieldError> : null}
        </div>

        <div className="flex justify-end p-2">
          <SubmitButton isDisabled={isDisabled}>Register</SubmitButton>
        </div>
      </form>
    </div>
  );
};
