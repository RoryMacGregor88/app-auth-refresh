import { Dispatch, FC, ReactElement, createContext, useState } from 'react';

import { useLocalStorage } from '@astrosat/react-utils';

export interface User {
  email: string;
  name?: string;
  accessToken?: string;
  roles?: number[];
}

type UserId = string | null;

type SetUserId = Dispatch<string | null>;

export type AuthenticationContextType = {
  userId: UserId;
  setUserId: SetUserId;
  user: User | null;
  setUser: Dispatch<User | null>;
  accessToken: string | null;
  setAccessToken: Dispatch<string | null>;
};

export const AuthenticationContext = createContext<AuthenticationContextType | null>(null);
AuthenticationContext.displayName = 'AuthenticationContext';

interface Props {
  initialState?: Partial<AuthenticationContextType>;
  children: ReactElement;
}

export const AuthenticationProvider: FC<Props> = ({ initialState = {}, children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useLocalStorage('userId', undefined);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const value = { userId, setUserId, user, setUser, accessToken, setAccessToken, ...initialState };

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>;
};
