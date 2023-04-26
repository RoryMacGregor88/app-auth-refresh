import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { useApiClient } from '~/api/api-client.hook';

import { useAuthentication } from '../authentication/authentication.hook';

const ENDPOINT = `${import.meta.env.VITE_API_URL}/api/users/`;

export const UserData = z.object({
  _id: z.string(),
  email: z.string(),
  password: z.string(),
  refreshTokens: z.array(z.string()),
  roles: z.array(z.number()),
});

const Users = z.array(UserData);

export type User = z.infer<typeof UserData>;

export const useUsers = (): UseQueryResult<User[]> => {
  const { accessToken } = useAuthentication();
  const apiClient = useApiClient();

  return useQuery(
    ['Users'],
    async () => {
      const data = await apiClient(ENDPOINT, null, null, { method: 'GET' });
      // const response = await fetch(ENDPOINT, {
      //   credentials: 'include',
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });

      // if (!response.ok) {
      //   const error = await response.json();

      //   throw new Error(`Error fetching Users, Message: ${error.message}`);
      // }

      // const data: User[] = await response.json();

      return Users.parse(data);
    },
    {
      retry: 1,
    },
  );
};
