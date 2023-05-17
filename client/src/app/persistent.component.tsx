import { FC, ReactElement, useCallback, useEffect, useState } from 'react';

import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

import { useAuthentication } from '~/accounts/authentication/authentication.hook';
import { useRefresh } from '~/accounts/authentication/refresh.hook';
import { User } from '~/accounts/users/users.hook';
import { LOADING_MESSAGE } from '~/api/api.constants';

/** refetch method type from @tanstack/react-query */
export type RefetchToken = <TPageData>(
  options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
) => Promise<QueryObserverResult<string, unknown>>;

interface Props {
  user: User | null;
  handleRefreshToken: (refetch: RefetchToken) => void;
}

export const Persistent: FC<Props> = ({ user, handleRefreshToken }): ReactElement => {
  const { accessToken } = useAuthentication();
  const { refetch, isError: isRefreshError, error: refreshError } = useRefresh();

  const [isLoadingToken, setIsLoadingToken] = useState(true);

  const verifyRefreshToken = useCallback(async () => {
    await handleRefreshToken(refetch);

    setIsLoadingToken(false);
  }, [handleRefreshToken, refetch]);

  useEffect(() => {
    accessToken ? setIsLoadingToken(false) : verifyRefreshToken();
  }, [accessToken, verifyRefreshToken]);

  if (isRefreshError) {
    const error = refreshError as Error;
    throw new Error(error.message);
  }

  const hasRefreshed = !!user && !isLoadingToken;
  return hasRefreshed ? <Outlet /> : <p>{LOADING_MESSAGE}</p>;
};
