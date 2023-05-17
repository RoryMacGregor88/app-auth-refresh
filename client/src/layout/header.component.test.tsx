/*eslint import/namespace: ["off"]*/
import { describe, expect, it } from 'vitest';

import { render, screen } from '~/test/test-renderers';

import { Header } from './header.component';

const user = {
  name: 'John',
  email: 'user@example.com',
  accessToken: '123',
  roles: [1, 2, 3],
};

describe('Header', () => {
  it('should render the header', () => {
    render(<Header />, { authInitialState: { user } });
    expect(screen.getByRole('heading', { name: `Hello ${user.name}` })).toBeInTheDocument();
  });
});
