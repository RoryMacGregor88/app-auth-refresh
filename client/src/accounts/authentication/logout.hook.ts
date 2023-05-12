import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useAuthentication } from '~/accounts/authentication/authentication.hook';

const ENDPOINT = `${import.meta.env.VITE_API_URL}/api/accounts/`;

export const useLogout = () => {
  const navigate = useNavigate();
  const { setUserId, setUser, setAccessToken } = useAuthentication();

  return useQuery({
    enabled: false,
    queryKey: ['logout'],
    queryFn: async () => {
      const response = await fetch(ENDPOINT, { credentials: 'include' });

      if (!response.ok) {
        const error = await response.json();
        return Promise.reject(new Error(error.message));
      }

      setUserId(null);
      setUser(null);
      setAccessToken(null);

      return null;
    },
    onSettled: () => {
      navigate('/login', { replace: true });
    },
  });
};
