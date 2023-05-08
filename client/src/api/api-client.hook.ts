import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuthentication } from '~/accounts/authentication/authentication.hook';
import { useLogout } from '~/accounts/authentication/logout.hook';
import { useRefresh } from '~/accounts/authentication/refresh.hook';

import { UNAUTHENTICATED_ERROR_MESSAGE, UNAUTHORIZED_ERROR } from './api.constants';

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
        const { isError, error, data: newAccessToken } = await refresh();

        if (isError) {
          return Promise.reject(error);
        }

        if (newAccessToken) {
          previousRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          response = await fetch(endpoint, previousRequest);
        }
      }

      if (!response.ok) {
        const error = await response.json();
        return Promise.reject(error);
      }

      return await response.json();
    },
    [accessToken, refresh],
  );
};
