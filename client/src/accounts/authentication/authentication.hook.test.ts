import { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor, screen } from '~/test/utils';
import { AuthenticationProvider } from './authentication.context';
import { useAuthentication } from './authentication.hook';

interface Result {
  children: ReactNode;
  userId: string;
  setUserId: Function;
  user: string;
  setUser: Function;
  accessToken: string;
  setAccessToken: Function;
}

describe('useAuthenticationHook', () => {
  it('should include the children', async () => {
    const expectedChildren = <h1>I am child</h1>;
    const wrapper = () => <AuthenticationProvider>{expectedChildren}</AuthenticationProvider>;

    renderHook<Result, unknown>(() => useAuthentication(), { wrapper });

    act(() => {
      expect(screen.getByRole('heading', { name: /i am child/i })).toBeInTheDocument();
    });
  });

  it('should make the user details available', async () => {
    // check to see if the data shape matches that of the authentication context
    const { result } = renderHook<Result, unknown>(() => useAuthentication());

    act(() => {
      expect(result.current.accessToken).toBeNull();
    });
  });
});
