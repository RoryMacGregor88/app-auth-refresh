import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const ENDPOINT = `${import.meta.env.VITE_API_URL}/api/app/config`;

export const AppConfigData = z.object({
  name: z.string(),
});

export type AppConfig = z.infer<typeof AppConfigData>;

export const useAppConfig = (): UseQueryResult<AppConfig> =>
  useQuery({
    placeholderData: { name: '' },
    queryKey: ['appConfig'],
    queryFn: async () => {
      const response = await fetch(ENDPOINT);

      if (!response.ok) {
        const error = await response.json();
        return Promise.reject(new Error(error.message));
      }

      const data: AppConfig = await response.json();
      return AppConfigData.parse(data);
    },
  });
