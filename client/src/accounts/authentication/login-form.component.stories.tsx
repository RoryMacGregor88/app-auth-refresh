import type { Meta, StoryObj } from '@storybook/react';

import { LoginForm } from './login-form.component';

const defaultValues = {
  email: 'example@email.com',
  password: 'password123',
};

const meta = {
  title: 'Components/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginForm>;

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

export const AllFieldsValid: Story = {
  args: { defaultValues },
};
