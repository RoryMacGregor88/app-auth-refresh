import { FC, ReactElement } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  EMAIL_REQUIRED_MESSAGE,
  FIRST_NAME_REQUIRED_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  LAST_NAME_REQUIRED_MESSAGE,
  PASSWORDS_NEED_TO_MATCH_MESSAGE,
  PASSWORD_CONFIRM_REQUIRED_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from '~/accounts/accounts.constants';
import { FieldError } from '~/components/forms/field-error.component';
import { SubmitButton } from '~/components/forms/submit-button.component';

import { RegistrationFormType } from './register.hook';

export const MandatoryField: FC = () => <span className="text-red-700">*</span>;

export type RegisterUser = (form: RegistrationFormType) => void;
interface FormProps {
  registerUser: RegisterUser;
}

const EMAIL_ID = 'email';
const FIRST_NAME_ID = 'firstName';
const LAST_NAME_ID = 'lastName';
const PASSWORD_ID = 'password';
const PASSWORD_CONFIRM_ID = 'confirmPassword';

export const RegistrationFormSchema = z
  .object({
    [EMAIL_ID]: z.string().min(1, { message: EMAIL_REQUIRED_MESSAGE }).email({ message: INVALID_EMAIL_MESSAGE }),
    [FIRST_NAME_ID]: z.string().min(1, { message: FIRST_NAME_REQUIRED_MESSAGE }),
    [LAST_NAME_ID]: z.string().min(1, { message: LAST_NAME_REQUIRED_MESSAGE }),
    [PASSWORD_ID]: z.string().min(1, { message: PASSWORD_REQUIRED_MESSAGE }),
    [PASSWORD_CONFIRM_ID]: z.string().min(1, { message: PASSWORD_CONFIRM_REQUIRED_MESSAGE }),
  })
  .superRefine((fields, ctx) => {
    if (fields[PASSWORD_ID] !== fields[PASSWORD_CONFIRM_ID]) {
      ctx.addIssue({
        code: 'custom',
        message: PASSWORDS_NEED_TO_MATCH_MESSAGE,
        path: [PASSWORD_CONFIRM_ID],
      });
    }
  });

const defaultFormValues = {
  [EMAIL_ID]: '',
  [PASSWORD_ID]: '',
  [PASSWORD_CONFIRM_ID]: '',
  [FIRST_NAME_ID]: '',
  [LAST_NAME_ID]: '',
};

export const RegisterForm: FC<FormProps> = ({ registerUser }): ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RegistrationFormType>({
    resolver: zodResolver(RegistrationFormSchema),
    defaultValues: defaultFormValues,
    mode: 'all',
  });
  const onSubmit: SubmitHandler<RegistrationFormType> = form => registerUser(form);

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
          disabled={isSubmitting}
        />
        {errors[PASSWORD_ID] ? <FieldError>{errors[PASSWORD_ID].message}</FieldError> : null}
      </div>

      <label htmlFor={PASSWORD_CONFIRM_ID}>
        Password Confirmation <MandatoryField />:
      </label>
      <div>
        <input
          id={PASSWORD_CONFIRM_ID}
          type={PASSWORD_ID}
          {...register(PASSWORD_CONFIRM_ID)}
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
          id={FIRST_NAME_ID}
          type="text"
          {...register(FIRST_NAME_ID)}
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
          id={LAST_NAME_ID}
          type="text"
          {...register(LAST_NAME_ID)}
          className="form-input"
          disabled={isSubmitting}
        />
        {errors[LAST_NAME_ID] ? <FieldError>{errors[LAST_NAME_ID].message}</FieldError> : null}
      </div>

      <div className="flex justify-end p-2">
        <SubmitButton isDisabled={isDisabled}>Register</SubmitButton>
      </div>
    </form>
  );
};
