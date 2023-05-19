import { FC } from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthentication } from '~/accounts/authentication/authentication.hook';
import { User } from '~/accounts/users/users.hook';

interface Props {
  user: User | null;
  roles: number[];
}

export const Authorization: FC<Props> = ({ user, roles }) => {
  const location = useLocation();
  const { accessToken } = useAuthentication();

  const hasRole = !!user?.roles?.find((role: number) => roles?.includes(role));

  return hasRole ? (
    <Outlet />
  ) : accessToken ? (
    <Navigate replace state={{ from: location }} to="/unauthorized" />
  ) : (
    <Navigate replace state={{ from: location }} to="/login" />
  );
};
