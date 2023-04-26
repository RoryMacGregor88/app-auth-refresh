import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuthentication } from '~/accounts/authentication/authentication.hook';
import { useLogout } from '~/accounts/authentication/logout.hook';
import { useRefresh } from '~/accounts/authentication/refresh.hook';

import { UNAUTHORIZED_ERROR } from './api.constants';

export const useApiClient = () => {
  const { accessToken } = useAuthentication();
  const { refetch: logout } = useLogout();
  const { refetch: refresh } = useRefresh();
  const navigate = useNavigate();

  return useCallback(
    async (
      endpoint: string,
      data: unknown = {},
      customHeaders: HeadersInit = {},
      config: Record<string, unknown> = {},
    ) => {
      // const headers = {};

      // if (accessToken) {
      //   headers.Authorization = `Bearer ${accessToken}`;
      // }

      // if (data) {
      //   headers['Content-Type'] = 'application/json';
      // }

      const method = config?.method as string;

      const customConfig: RequestInit = {
        method: method ? method : 'POST',
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include',
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
          'Content-Type': 'application/json',
          // 'Content-Type': data ? 'application/json' : undefined,
          ...customHeaders,
        },
        ...config,
      };
      let response = await fetch(endpoint, customConfig);

      const previousRequest = customConfig;
      if (response.status === UNAUTHORIZED_ERROR && !previousRequest?.sent) {
        previousRequest.sent = true;
        const { data: newAccessToken } = await refresh();

        if (newAccessToken) {
          previousRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          response = await fetch(endpoint, previousRequest);
        }

        // await logout();
        // navigate('/', { replace: true });
        // return Promise.reject({ message: 'Please re-authenticate' });
      }

      if (!response.ok) {
        return Promise.reject({ message: 'Please re-authenticate' });
      }

      const responseData = await response.json();

      return response.ok ? responseData : Promise.reject(responseData);
    },
    [accessToken, refresh],
  );
};
