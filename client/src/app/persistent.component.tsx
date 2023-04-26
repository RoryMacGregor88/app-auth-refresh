import { FC, ReactElement, useEffect, useState } from 'react';

import { Outlet } from 'react-router-dom';

import { useAuthentication } from '~/accounts/authentication/authentication.hook';
import { useRefresh } from '~/accounts/authentication/refresh.hook';
import { User } from '~/accounts/users/users.hook';

interface Props {
  user: User;
}

export const Persistent: FC<Props> = ({ user }): ReactElement => {
  const { accessToken } = useAuthentication();
  const { refetch: refreshToken } = useRefresh();

  const [isLoadingToken, setIsLoadingToken] = useState(true);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.log('Error in Persistent: ', error);
      } finally {
        setIsLoadingToken(false);
      }
    };

    accessToken ? setIsLoadingToken(false) : verifyRefreshToken();
  }, [accessToken, refreshToken]);

  const hasRefreshed = !!user && !isLoadingToken;
  return hasRefreshed ? <Outlet /> : <p>Loading...</p>;
};
