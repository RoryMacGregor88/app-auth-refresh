import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuthentication } from '~/accounts/authentication/authentication.hook';
import { useRefresh } from '~/accounts/authentication/refresh.hook';

import { UNAUTHORIZED_ERROR } from './api.constants';

export const useApiClient = () => {
  const { accessToken } = useAuthentication();
  const { refetch: refresh } = useRefresh();

  return useCallback(
    async (
      endpoint: string,
      data: unknown = {},
      customHeaders: HeadersInit = {},
      config: Record<string, unknown> = {},
    ) => {
      const method = config?.method as string;

      const customConfig: RequestInit = {
        method: method ? method : 'POST',
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include',
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
          'Content-Type': 'application/json',
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
