import { Request, Response } from 'express';

import { BAD_REQUEST_ERROR, CREATED, NO_CONTENT } from '~/utils/http';

import { EmployeeModel } from './employee.model';

export const getEmployees = async (req: Request, res: Response) => {
  const employees = await EmployeeModel.find();

  if (!employees) {
    res.status(NO_CONTENT).json({ message: 'No employees found.' });
  }

  res.json(employees);
};

export const getEmployee = async (req: Request, res: Response) => {
  if (!req?.params?.id) {
    return res.status(BAD_REQUEST_ERROR).json({ message: 'ID of user required' });
  }

  const employee = await EmployeeModel.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    res.status(BAD_REQUEST_ERROR).json({ message: `Employee with ID: ${req?.params?.id} not found.` });
  }

  res.json(employee);
};

export const createEmployee = async (req: Request, res: Response) => {
  if (!req?.body?.firstName || !req?.body?.surname) {
    return res.status(BAD_REQUEST_ERROR).json({ message: 'First and last names are required.' });
  }

  try {
    const result = await EmployeeModel.create({
      firstName: req.body.firstName,
      surname: req.body.surname,
    });

    res.status(CREATED).json(result);
  } catch (error) {
    console.error(error);
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  if (!req?.body?.id) {
    return res.status(BAD_REQUEST_ERROR).json({ message: 'ID of user is required.' });
  }

  const employee = await EmployeeModel.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res.status(NO_CONTENT).json({ message: `Employee with ID: ${req.body.id} not found.` });
  }

  if (req.body.firstName) {
    employee.firstName = req.body.firstName;
  }

  if (req.body.surname) {
    employee.surname = req.body.surname;
  }

  const result = await employee.save();

  res.json(result);
};

export const deleteEmployee = async (req: Request, res: Response) => {
  if (!req?.params?.id) {
    return res.status(BAD_REQUEST_ERROR).json({ message: 'Employee ID of is required. ' });
  }

  const employee = await EmployeeModel.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    return res.status(BAD_REQUEST_ERROR).json({ message: `Employee with ID: ${req.params.id} not found.` });
  }

  const result = await EmployeeModel.deleteOne({ _id: req.params.id });

  res.json(result);
};
