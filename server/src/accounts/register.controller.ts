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
  // const { email, password } = req.body;

  // // If neither email or password exist, then it's not possible to
  // // register the user, so return an error message.
  // if (!email || !password) {
  //   return res.status(BAD_REQUEST_ERROR).json({ message: 'Email and password are required.' });
  // }

  // // Check if email/username already exists.
  // const existingUser = await UserModel.findOne({ email }).exec();
  // if (existingUser) {
  //   return res.sendStatus(CONFLICT_ERROR);
  // }

  // try {
  //   // Encrypt password.
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   // Store the new user.
  //   const result = await UserModel.create({
  //     email,
  //     password: hashedPassword,
  //   });

  //   res.status(CREATED).json({
  //     message: 'New user created',
  //   });
  // } catch (error) {
  //   if (error instanceof Error) {
  //     res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
  //   } else {
  //     res.status(INTERNAL_SERVER_ERROR).json({ message: `Unexpected Error: ${error}` });
  //   }
  // }
};
