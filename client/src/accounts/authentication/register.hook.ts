import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useApiClient } from '~/api/api-client.hook';
import { User } from '~/mocks/handlers/authentication';

const ENDPOINT = `${import.meta.env.VITE_API_URL}/api/accounts/register/`;

export const RegistrationFormSchema = z.object({
  id: z.optional(z.number()),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});

export type RegistrationFormType = z.infer<typeof RegistrationFormSchema>;

export const useRegister = () => {
  const apiClient = useApiClient();

  return useMutation(async (form: RegistrationFormType) => {
    const data = await apiClient(ENDPOINT, form);
    // const response = await fetch(ENDPOINT, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(form),
    // });

    // if (!response.ok) {
    //   const error = await response.json();

    //   throw new Error(`Problem Registering User: ${error.message}`);
    // }

    // const data = await response.json();

    // return RegistrationFormSchema.parse(data);
    return data.id;
  });

  // const register = async (form: RegistrationFormType) => {
  //   try {
  //     // Register new user.
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // return register;
};
