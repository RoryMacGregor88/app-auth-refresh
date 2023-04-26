import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { FORBIDDEN_ERROR, UNAUTHORIZED_ERROR } from '~/utils/http';

interface User {
  username: string;
}

// declare module 'jsonwebtoken' {
//   export interface JwtPayload {
//     user: User;
//   }
// }

interface UserJwtPayload extends JwtPayload {
  user: User;
}

interface UserRequest extends Request {
  user: User;
}

export const verifyJwt = (req: UserRequest, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.Authorization ?? req.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return res.sendStatus(UNAUTHORIZED_ERROR);
  }

  // Get the token part.
  const token = authorizationHeader.split(' ')[1];

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessTokenSecret) {
    throw new Error('Access token secret does not exist');
  }

  // const payload = jwt.verify(token, accessTokenSecret) as UserJwtPayload;
  // req.user = payload.user;

  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) {
      return res.sendStatus(UNAUTHORIZED_ERROR);
      // return res.sendStatus(FORBIDDEN_ERROR);
    }

    req.user = decoded?.email;

    next();
  });
  // , (error, payload: JwtPayload) => {

  //   if (error) {
  //     return res.sendStatus(FORBIDDEN_ERROR);
  //   }

  //   req.user = payload?.user;

  //   next();
  // });
};
