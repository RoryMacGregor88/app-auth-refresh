import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { useApiClient } from '~/api/api-client.hook';

import { User, UserData } from './users.hook';
import { useAuthentication } from '../authentication/authentication.hook';

const ENDPOINT = `${import.meta.env.VITE_API_URL}/api/users`;

export const useUser = (): UseQueryResult<User> => {
  const apiClient = useApiClient();
  const { userId, setUser, accessToken } = useAuthentication();

  return useQuery({
    enabled: !!userId && !!accessToken,
    placeholderData: null,
    queryKey: ['User', userId],
    queryFn: async () => {
      const user = await apiClient(`${ENDPOINT}/${userId}`, null, {}, { method: 'GET' });

      const parsedUser = UserData.parse(user);

      setUser(parsedUser);
      return parsedUser;
    },
  });
};
