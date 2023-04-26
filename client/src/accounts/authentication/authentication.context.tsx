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
  children: ReactElement;
}

export const AuthenticationProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useLocalStorage('userId', undefined);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <AuthenticationContext.Provider value={{ userId, setUserId, user, setUser, accessToken, setAccessToken }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
