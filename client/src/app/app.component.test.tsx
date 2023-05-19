/*eslint import/namespace: ["off"]*/
import { describe, expect, it } from 'vitest';

import { rest, server } from '~/mocks/server';
import { render, screen } from '~/test/test-renderers';

import { App } from './app.component';

const ENDPOINT = '*/api/accounts/refresh';

const user = {
  name: 'John',
  email: 'user@example.com',
  accessToken: '123',
  roles: [1, 2, 3],
};

describe('App', () => {
  it('should render the whole app', () => {
    server.use(rest.get(ENDPOINT, (req, res, ctx) => res(ctx.status(200), ctx.json({ accessToken: '123456' }))));

    render(<App />, { authInitialState: { user } });

    expect(screen.getByRole('heading', { name: `Hello ${user.name}` })).toBeInTheDocument();
  });
});
