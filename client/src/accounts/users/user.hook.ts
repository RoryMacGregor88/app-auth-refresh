import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { User, UserData } from './users.hook';
import { useAuthentication } from '../authentication/authentication.hook';

const ENDPOINT = `${import.meta.env.VITE_API_URL}/api/users`;

export const useUser = (): UseQueryResult<User> => {
  const { userId, setUser, accessToken } = useAuthentication();

  return useQuery({
    enabled: !!userId && !!accessToken,
    placeholderData: null,
    queryKey: ['User', userId],
    queryFn: async () => {
      const response = await fetch(`${ENDPOINT}/${userId}`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return Promise.reject(new Error(error.message));
      }

      const data: User = await response.json();

      setUser(data);

      return UserData.parse(data);
    },
  });
};
