import { FC, ReactElement } from 'react';

import { Route, Routes } from 'react-router-dom';

import { useAuthentication } from '~/accounts/authentication/authentication.hook';
import { Login } from '~/accounts/authentication/login.component';
import { Register } from '~/accounts/authentication/register.component';
import { useUser } from '~/accounts/users/user.hook';
import { Admin } from '~/admin/admin.component';
import { Layout } from '~/layout/layout.component';

import { useAppConfig } from './app-config.hook';
import { Authorization } from './authorization.component';
import { Editor } from './editor.component';
import { Home } from './home.component';
import { Links } from './links.component';
import { Lounge } from './lounge.component';
import { Persistent } from './persistent.component';
import { Unauthorized } from './unauthorized.component';

export enum Roles {
  USER = 1,
  EDITOR = 2,
  ADMIN = 3,
}

export const App: FC = (): ReactElement => {
  // const { data: appConfig } = useAppConfig();
  const { data: user } = useUser();
  return (
    <Routes>
      <Route element={<Layout />} path="/">
        {/* public routes */}
        <Route element={<Register />} path="register" />
        <Route element={<Login />} path="/login" />
        <Route element={<Links />} path="links" />
        <Route element={<Unauthorized />} path="unauthorized" />

        {/* we want to protect these routes */}
        <Route element={<Persistent user={user} />}>
          <Route element={<Authorization roles={[Roles.USER]} user={user} />}>
            <Route element={<Home />} path="/" />
          </Route>

          <Route element={<Authorization roles={[Roles.EDITOR]} user={user} />}>
            <Route element={<Editor />} path="editor" />
          </Route>

          <Route element={<Authorization roles={[Roles.ADMIN]} user={user} />}>
            <Route element={<Admin />} path="admin" />
          </Route>

          <Route element={<Authorization roles={[Roles.EDITOR, Roles.ADMIN]} user={user} />}>
            <Route element={<Lounge />} path="lounge" />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
