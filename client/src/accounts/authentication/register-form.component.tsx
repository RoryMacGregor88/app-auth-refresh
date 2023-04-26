import { FC, ReactElement } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { FieldError } from '~/components/forms/field-error.component';
import { SubmitButton } from '~/components/forms/submit-button.component';

import { RegistrationFormSchema, RegistrationFormType } from './register.hook';

export const MandatoryField: FC = () => <span className="text-red-700">*</span>;

interface FormProps {
  registerUser: (form: RegistrationFormType) => void;
}

const EMAIL_ID = 'email';
const PASSWORD_ID = 'password';
const PASSWORD_CONFIRM_ID = 'confirmPassword';
const FIRST_NAME_ID = 'firstName';
const LAST_NAME_ID = 'lastName';

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
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormType>({
    resolver: zodResolver(RegistrationFormSchema),
    defaultValues: defaultFormValues,
  });

  const onSubmit: SubmitHandler<RegistrationFormType> = form => registerUser(form);

  return (
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
          aria-required={true}
          className="form-input"
          disabled={isSubmitting}
        />

        {errors[LAST_NAME_ID] ? <FieldError>{errors[LAST_NAME_ID].message}</FieldError> : null}
      </div>

      <div className="flex justify-end p-2">
        <SubmitButton isDisabled={isSubmitting}>Register</SubmitButton>
      </div>
    </form>
  );
};
