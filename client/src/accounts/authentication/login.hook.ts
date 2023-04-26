import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useApiClient } from '~/api/api-client.hook';
// import { User } from '~/mocks/handlers/authentication';

import { useAuthentication } from './authentication.hook';

const ENDPOINT = `${import.meta.env.VITE_API_URL}/api/accounts/`;

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  accessToken: z.optional(z.string()),
});

export type LoginFormType = z.infer<typeof LoginFormSchema>;

export const useLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserId, setAccessToken } = useAuthentication();
  const apiClient = useApiClient();

  return useMutation(async (form: LoginFormType) => {
    const data = await apiClient(ENDPOINT, form);

    setUserId(data.id);
    setAccessToken(data.accessToken);

    return data;
  });
};
