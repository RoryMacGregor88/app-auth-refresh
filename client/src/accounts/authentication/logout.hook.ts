import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useAuthentication } from '~/accounts/authentication/authentication.hook';
import { useApiClient } from '~/api/api-client.hook';

const ENDPOINT = `${import.meta.env.VITE_API_URL}/api/accounts/`;

interface Args {
  // TODO: is this right?
  onSettled: () => unknown;
}

export const useLogout = ({ onSettled }: Args) => {
  const navigate = useNavigate();
  const { setUserId, setUser, setAccessToken } = useAuthentication();
  const apiClient = useApiClient();

  return useQuery({
    enabled: false,
    queryKey: ['logout'],
    queryFn: async () => {
      /** nothing is returned from logout endpoint */
      await apiClient(ENDPOINT);

      setUserId(null);
      setUser(null);
      setAccessToken(null);

      return null;
    },
    onSettled: () => {
      if (onSettled) {
        onSettled();
      } else {
        navigate('/login', { replace: true });
      }
    },
  });
};
