import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { useLogout } from '~/accounts/authentication/logout.hook';
import { UNAUTHORIZED_ERROR } from '~/api/api.constants';

import { useAuthentication } from '../authentication/authentication.hook';

const ENDPOINT = `${import.meta.env.VITE_API_URL}/api/accounts/refresh`;

export const useRefresh = (): UseQueryResult<string> => {
  const { setAccessToken } = useAuthentication();
  const { refetch: logout } = useLogout();

  return useQuery({
    enabled: false,
    queryKey: ['Refresh'],
    queryFn: async () => {
      const response = await fetch(ENDPOINT, {
        credentials: 'include',
      });

      if (response.status === UNAUTHORIZED_ERROR) {
        await logout();
        return null;
      }

      if (!response.ok) {
        throw new Error('Error Refreshing tokens');
      }

      const data = await response.json();

      setAccessToken(data.accessToken);
      return data.accessToken;
    },
  });
};
