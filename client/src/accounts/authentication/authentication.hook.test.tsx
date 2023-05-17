/*eslint import/namespace: ["off"]*/
import { Dispatch } from 'react';

import { describe, expect, it } from 'vitest';

import { act, renderHook, waitFor } from '~/test/test-renderers';

import { AuthenticationContextType, User } from './authentication.context';
import { useAuthentication } from './authentication.hook';

const mockUserId = 'test-user-id-1';
const mockAccessToken = 'test-access-token-1';
const mockUser = {
  email: 'user@example.com',
  name: 'John Smith',
  accessToken: mockAccessToken,
  roles: [1, 2, 3],
};

let mockSetUserId: Dispatch<string | null>;
let mockSetUser: Dispatch<User | null>;
let mockSetAccessToken: Dispatch<string | null>;

describe('useAuthenticationHook', () => {
  beforeEach(() => {
    mockSetUserId = vi.fn();
    mockSetUser = vi.fn();
    mockSetAccessToken = vi.fn();
  });

  it('should access and update userId', async () => {
    const updatedUserId = 'test-user-id-2';

    const { result } = renderHook<AuthenticationContextType, unknown>(() => useAuthentication(), {
      authInitialState: {
        userId: mockUserId,
        setUserId: mockSetUserId,
      },
    });

    const { userId, setUserId } = result.current;

    expect(userId).toEqual(mockUserId);

    await act(() => setUserId(updatedUserId));

    await waitFor(() => {
      expect(setUserId).toHaveBeenCalledWith(updatedUserId);
    });
  });

  it('should access and update user', async () => {
    const updatedUser = { ...mockUser, name: 'Steve Brown' };

    const { result } = renderHook<AuthenticationContextType, unknown>(() => useAuthentication(), {
      authInitialState: {
        user: mockUser,
        setUser: mockSetUser,
      },
    });

    const { user, setUser } = result.current;

    expect(user).toEqual(mockUser);

    await act(() => setUser(updatedUser));

    await waitFor(() => {
      expect(setUser).toHaveBeenCalledWith(updatedUser);
    });
  });

  it('should access and update accessToken', async () => {
    const updatedAccessToken = 'test-access-token-2';

    const { result } = renderHook<AuthenticationContextType, unknown>(() => useAuthentication(), {
      authInitialState: {
        accessToken: mockAccessToken,
        setAccessToken: mockSetAccessToken,
      },
    });

    const { accessToken, setAccessToken } = result.current;

    expect(accessToken).toEqual(mockAccessToken);

    await act(() => setAccessToken(updatedAccessToken));

    await waitFor(() => {
      expect(setAccessToken).toHaveBeenCalledWith(updatedAccessToken);
    });
  });
});
