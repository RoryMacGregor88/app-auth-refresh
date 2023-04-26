import { Request, Response } from 'express';

import { UserModel } from '~/users/user.model';
import { NO_CONTENT } from '~/utils/http';

/**
 * Log a user out of the app, clearing any cookies set.
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @return {*}
 */
export const logout = async (req: Request, res: Response) => {
  const refreshCookieName = process.env.REFRESH_COOKIE_NAME;
  if (!refreshCookieName) {
    throw new Error('Missing Environment Variable for the cookie name');
  }

  const cookies = req.cookies;

  if (!cookies[refreshCookieName]) {
    return res.sendStatus(NO_CONTENT);
  }

  const refreshToken = cookies[refreshCookieName];

  const existingUser = await UserModel.findOne({ refreshTokens: refreshToken }).exec();

  if (!existingUser) {
    res.clearCookie(refreshCookieName, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return res.sendStatus(NO_CONTENT);
  }

  // Delete refresh token
  existingUser.refreshTokens = existingUser.refreshTokens.filter(token => token !== refreshToken);
  // Save user, minus token in request.
  await existingUser.save();

  res.clearCookie(refreshCookieName, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  return res.sendStatus(NO_CONTENT);
};
