import type { Meta, StoryObj } from '@storybook/react';

import { RegisterForm } from './register-form.component';

const defaultValues = {
  email: 'example@email.com',
  firstName: 'John',
  lastName: 'Smith',
  password: 'password123',
  confirmPassword: 'password123',
};

const meta = {
  title: 'Components/RegisterForm',
  component: RegisterForm,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyFields: Story = {
  args: {},
};

export const InvalidEmail: Story = {
  args: {
    defaultValues: {
      ...defaultValues,
      email: 'invalid email',
    },
  },
};

export const PasswordsDoNotMatch: Story = {
  args: {
    defaultValues: {
      ...defaultValues,
      confirmPassword: 'password456',
    },
  },
};

export const AllFieldsValid: Story = {
  args: { defaultValues },
};
