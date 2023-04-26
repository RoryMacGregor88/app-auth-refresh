import { NextFunction, Request, Response } from 'express';

import { UNAUTHORIZED_ERROR } from '~/utils/http';

interface RolesRequest extends Request {
  roles: number[];
}

export const verifyRoles =
  (...roles: number[]) =>
  (req: RolesRequest, res: Response, next: NextFunction) => {
    if (!req?.roles) {
      return res.sendStatus(UNAUTHORIZED_ERROR);
    }

    const result = req.roles.map(role => roles.includes(role)).find(role => role === true);

    if (!result) {
      return res.sendStatus(UNAUTHORIZED_ERROR);
    }

    next();
  };
