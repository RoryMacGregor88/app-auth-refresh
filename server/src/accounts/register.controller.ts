import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { createUser } from '~/users/user.controller';
import { UserModel } from '~/users/user.model';
import { BAD_REQUEST_ERROR, CONFLICT_ERROR, CREATED, INTERNAL_SERVER_ERROR } from '~/utils/http';

/**
 * Register a new user, checking if unique email already exists and
 * hashes the password before storing it.
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @return {*}
 */
export const register = async (req: Request, res: Response) => {
  createUser(req, res);
};
