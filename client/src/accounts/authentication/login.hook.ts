import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useApiClient } from '~/api/api-client.hook';

import { useAuthentication } from './authentication.hook';

const ENDPOINT = `${import.meta.env.VITE_API_URL}/api/accounts/`;

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginFormType = z.infer<typeof LoginFormSchema>;

export const UserConfigSchema = z.object({
  id: z.string(),
  accessToken: z.string(),
});

export type UserConfigType = z.infer<typeof UserConfigSchema>;

export const useLogin = () => {
  const { setUserId, setAccessToken } = useAuthentication();
  const apiClient = useApiClient();

  return useMutation(async (form: LoginFormType): Promise<UserConfigType> => {
    const data = await apiClient(ENDPOINT, form);

    const parsedData = UserConfigSchema.parse(data);

    setUserId(parsedData.id);
    setAccessToken(parsedData.accessToken);

    return parsedData;
  });
};
