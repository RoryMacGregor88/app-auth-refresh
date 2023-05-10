import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { BAD_REQUEST_ERROR, CONFLICT_ERROR, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT } from '~/utils/http';

import { UserModel } from './user.model';

export const getUsers = async (req: Request, res: Response) => {
  const users = await UserModel.find();

  if (!users) {
    res.status(BAD_REQUEST_ERROR).json({ message: 'No users found.' });
  }

  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  if (!req?.params?.id) {
    return res.status(BAD_REQUEST_ERROR).json({ message: 'ID of user required' });
  }

  const user = await UserModel.findOne({ _id: req.params.id }).exec();

  if (!user) {
    res.status(BAD_REQUEST_ERROR).json({ message: `User with ID: ${req?.params?.id} not found.` });
  }

  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  // If neither email or password exist, then it's not possible to
  // register the user, so return an error message.
  if (!email || !password) {
    return res.status(BAD_REQUEST_ERROR).json({ message: 'Email and password are required.' });
  }

  // Check if email/username already exists.
  const existingUser = await UserModel.findOne({ email }).exec();
  if (existingUser) {
    return res.sendStatus(CONFLICT_ERROR);
  }

  try {
    // const result = await UserModel.create({
    //   email: req.body.email,
    //   password: req.body.email,
    //   roles: [1],
    //   refreshTokens: [],
    //   firstName: req.body.firstName,
    //   lastName: req.body.lastName,
    // });

    // res.status(CREATED).json(result);
    // Encrypt password.
    const hashedPassword = await bcrypt.hash(password, 10);
    // Store the new user.
    const result = await UserModel.create({
      email,
      password: hashedPassword,
      roles: [1],
      refreshTokens: [],
      firstName: firstName ?? '',
      lastName: lastName ?? '',
    });

    res.sendStatus(CREATED).json({
      id: result._id,
    });
  } catch (error) {
    // console.error(error);
    if (error instanceof Error) {
      res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
    } else {
      res.status(INTERNAL_SERVER_ERROR).json({ message: `Unexpected Error: ${error}` });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  if (!req?.body?.id) {
    return res.status(BAD_REQUEST_ERROR).json({ message: 'ID of user is required.' });
  }

  const user = await UserModel.findOne({ _id: req.body.id }).exec();

  if (!user) {
    return res.status(BAD_REQUEST_ERROR).json({ message: `User with ID: ${req.body.id} not found.` });
  }

  if (req.body.roles) {
    user.roles = req.body.roles;
  }

  if (req.body.firstName) {
    user.firstName = req.body.firstName;
  }

  if (req.body.lastName) {
    user.lastName = req.body.lastName;
  }

  const result = await user.save();

  res.json(result);
};

export const deleteUser = async (req: Request, res: Response) => {
  if (!req?.params?.id) {
    return res.status(BAD_REQUEST_ERROR).json({ message: 'User ID is required. ' });
  }

  const user = await UserModel.findOne({ _id: req.params.id }).exec();

  if (!user) {
    return res.status(BAD_REQUEST_ERROR).json({ message: `User with ID: ${req.params.id} not found.` });
  }

  await UserModel.deleteOne({ _id: req.params.id });

  res.status(NO_CONTENT);
};
