import { Request, Response } from 'express';
import jwt, { Secret, VerifyErrors } from 'jsonwebtoken';

import { UserModel } from '~/users/user.model';
import { FORBIDDEN_ERROR, UNAUTHORIZED_ERROR } from '~/utils/http';

import { ACCESS_TOKEN_DURATION, COOKIE_MAX_AGE, REFRESH_TOKEN_DURATION } from './accounts.constants';

export const refreshToken = async (req: Request, res: Response) => {
  const refreshCookieName = process.env.REFRESH_COOKIE_NAME;

  if (!refreshCookieName) {
    throw new Error('Missing Environment Variable for the cookie name');
  }

  const cookies = req.cookies;

  if (!cookies[refreshCookieName]) {
    return res.sendStatus(UNAUTHORIZED_ERROR);
  }

  const refreshToken = cookies[refreshCookieName];
  res.clearCookie(refreshCookieName, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  // const existingUser = await UserModel.find().findByRefreshToken(refreshToken).exec();
  const existingUser = await UserModel.findOne({ refreshTokens: refreshToken }).exec();
  if (!existingUser) {
    // Detected re-use of the refresh token, if cookie with token, but
    // no associated user, then might have been hacked, so we need to
    // invalidate all refresh tokens for that user.
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as Secret,
      async (err: VerifyErrors, decoded: Record<string, unknown>) => {
        if (err) {
          return res.sendStatus(UNAUTHORIZED_ERROR);
        }
        // We now have a the decoded user associated
        // with the refresh token.
        const compromisedUser = await UserModel.findOne({ email: decoded.email }).exec();

        if (!compromisedUser) {
          throw new Error('No user associated with token found');
        }

        // Remove all refresh tokens for the user,
        // this logs users out of all devices.
        compromisedUser.refreshTokens = [];
        const result = await compromisedUser.save();
        console.log('Invalided user having removed refresh tokens: ', result);
      },
    );
    return res.sendStatus(UNAUTHORIZED_ERROR);
  }

  // Remove cleared tokens from user's list of refresh tokens.
  const refreshTokens = existingUser.refreshTokens.filter(token => token !== refreshToken);

  // Evaluate refresh token.
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as Secret,
    async (err: VerifyErrors, decoded: Record<string, unknown>) => {
      if (err) {
        existingUser.refreshTokens = [...refreshTokens];
        const result = await existingUser.save();
        console.log('Removed cleared refresh tokens from users list of tokens: ', result);
      }

      if (err || existingUser.email !== decoded.email) {
        return res.sendStatus(UNAUTHORIZED_ERROR);
      }

      // Refresh token is still valid.
      const roles = Object.values(existingUser.roles);

      const accessToken = jwt.sign({ email: decoded.email }, process.env.ACCESS_TOKEN_SECRET as Secret, {
        expiresIn: ACCESS_TOKEN_DURATION,
      });

      const newRefreshToken = jwt.sign({ email: existingUser.email }, process.env.REFRESH_TOKEN_SECRET as Secret, {
        expiresIn: REFRESH_TOKEN_DURATION,
      });

      // Put refresh token into database against current user.
      existingUser.refreshTokens = [...refreshTokens, newRefreshToken];
      const result = await existingUser.save();

      // Set http only cookie, so it isn't available to JavaScript.
      // const refreshCookieName = process.env.refreshCookieName;
      // if (!refreshCookieName) {
      //   throw new Error('Missing Environment Variable for the cookie name');
      // }

      res.cookie(refreshCookieName, newRefreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: COOKIE_MAX_AGE,
      });

      res.json({ accessToken, id: existingUser._id });
    },
  );
};
