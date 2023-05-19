import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';

import { LoginForm } from './login-form.component';

const meta: Meta<typeof LoginForm> = {
  title: 'Components/OneOff/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const EmptyForm: Story = {};

export const CanSubmitFilledForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');
    await userEvent.type(canvas.getByTestId('password'), 'a-random-password');
    await waitFor(() => expect(canvas.getByRole('button')).toBeEnabled());
  },
};

export const CantSubmitWithErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('email'), 'hello');
    await waitFor(() => expect(canvas.getByRole('button', { name: /login/i })).toBeDisabled());
  },
};
