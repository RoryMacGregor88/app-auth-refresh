/*eslint import/namespace: ["off"]*/
import { describe, expect, it } from 'vitest';

import { render, screen } from '~/test/utils';

import { App } from './app.component';

const user = {
  name: 'John',
  email: 'user@example.com',
  accessToken: '123',
  roles: [1, 2, 3],
};

describe('App', () => {
  it('should render the whole app', () => {
    render(<App />, { authInitialState: { user } });

    expect(screen.getByRole('heading', { name: `Hello ${user.name}` })).toBeInTheDocument();
  });
});
