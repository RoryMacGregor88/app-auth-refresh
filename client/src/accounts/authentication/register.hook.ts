import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useApiClient } from '~/api/api-client.hook';

const ENDPOINT = `${import.meta.env.VITE_API_URL}/api/accounts/register/`;

export const RegistrationFormSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

export type RegistrationFormType = z.infer<typeof RegistrationFormSchema>;

const RegistrationResponseSchema = z.object({ id: z.number() });
type RegistrationResponseType = z.infer<typeof RegistrationResponseSchema>;

export const useRegister = () => {
  const apiClient = useApiClient();

  return useMutation(async (form: RegistrationFormType) => {
    const parsedForm = RegistrationFormSchema.parse(form);

    const data: RegistrationResponseType = await apiClient(ENDPOINT, parsedForm);

    return RegistrationResponseSchema.parse(data);
  });
};
