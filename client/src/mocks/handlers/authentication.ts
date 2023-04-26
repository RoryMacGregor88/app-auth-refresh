import { rest } from 'msw';

import { Roles } from '~/app/app.component';
import { addUser, getUsers } from '~/mocks/fixtures/accounts';

// Descript the shape of the response body.
export interface User {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: number[];
}

interface AuthenticationResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

const handleRegistration = rest.post<User, AuthenticationResponse>('*/api/accounts/register', async (req, res, ctx) => {
  const body: User = await req.json();
  body.roles = [Roles.USER];

  // Check if user already exists.
  const users = getUsers();
  const foundUser = users.find(user => user.email === body.email);
  if (foundUser) {
    return res(ctx.status(400), ctx.json({ message: 'User already exists' }));
  }

  const user = addUser(body);

  return res(ctx.status(200), ctx.json(user));
});

const handleLogin = rest.post<User, AuthenticationResponse>('*/api/accounts/', async (req, res, ctx) => {
  const body: User = await req.json();
  const users = getUsers();

  const foundUser = users.find(user => user.email === body.email);

  return foundUser
    ? res(ctx.status(200), ctx.json(foundUser))
    : res(ctx.status(400), ctx.json({ message: 'User not found' }));
});

const handlers = [handleRegistration, handleLogin];

export default handlers;
