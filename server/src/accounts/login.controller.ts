import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User, UserModel } from '~/users/user.model';
import { BAD_REQUEST_ERROR, FORBIDDEN_ERROR, UNAUTHORIZED_ERROR } from '~/utils/http';

import { ACCESS_TOKEN_DURATION, COOKIE_MAX_AGE, REFRESH_TOKEN_DURATION } from './accounts.constants';

export const login = async (req: Request, res: Response) => {
  const refreshCookieName = process.env.REFRESH_COOKIE_NAME;
  if (!refreshCookieName) {
    throw new Error('Missing Environment Variable for the cookie name');
  }

  const cookies = req.cookies;
  const { email, password } = await req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST_ERROR).json({ message: 'Username and password are required' });
  }

  const existingUser = await UserModel.findOne({ email }).exec();

  if (!existingUser) {
    return res.sendStatus(UNAUTHORIZED_ERROR);
  }

  // Check password
  const doesPasswordMatch = await bcrypt.compare(password, existingUser.password);

  if (doesPasswordMatch) {
    // Get the role codes for the existing user.
    // Remove any null values, if they exist.
    // FIXME: How can null values exist???
    // const roles = Object.values(existingUser.roles).filter(Boolean);

    // Create access and refresh JWTs.
    const accessToken = jwt.sign({ email: existingUser.email }, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: ACCESS_TOKEN_DURATION,
    });
    const refreshToken = jwt.sign({ email: existingUser.email }, process.env.REFRESH_TOKEN_SECRET as string, {
      expiresIn: REFRESH_TOKEN_DURATION,
    });

    let validRefreshTokens = !cookies[refreshCookieName]
      ? existingUser.refreshTokens
      : existingUser.refreshTokens.filter(token => token !== cookies[refreshCookieName]);

    if (cookies[refreshCookieName]) {
      // It's possible the user logged in, but never
      // used the refresh token, or logged out. It
      // could be possibl that the refresh token was
      // stolen, so we need to make sure we check
      // the re-use of the token.
      const cookieRefreshToken = cookies[refreshCookieName];
      const usersRefreshToken = await UserModel.findOne({ refreshTokens: cookieRefreshToken }).exec();

      // Check token hasn't been re-used.
      if (!usersRefreshToken) {
        console.log('Attempted refresh token re-use at login');
        validRefreshTokens = [];
      }

      res.clearCookie(refreshCookieName, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
    }

    // Put new refresh token into database against current user.
    existingUser.refreshTokens = [...validRefreshTokens, refreshToken];
    const result: User = await existingUser.save();

    // Set the http only cookie, to have the new
    // refresh token.
    res.cookie(refreshCookieName, refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: COOKIE_MAX_AGE,
    });

    res.json({ id: result._doc._id, accessToken });
  } else {
    res.sendStatus(FORBIDDEN_ERROR);
  }
};
