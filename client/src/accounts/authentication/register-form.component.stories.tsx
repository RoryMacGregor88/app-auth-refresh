import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';

import { StoryWrapper } from '~/stories/utils';

import { RegisterForm } from './register-form.component';

const meta: Meta<typeof RegisterForm> = {
  title: 'Components/OneOff/RegisterForm',
  component: RegisterForm,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NoFieldsFilledIn: Story = {
  args: {},
};

export const EmptyForm: Story = {};

export const CanSubmitFilledForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('email'), 'firstname.lastname@provider.com');
    await userEvent.type(canvas.getByTestId('firstName'), 'firstname');
    await userEvent.type(canvas.getByTestId('lastName'), 'lastname');
    await userEvent.type(canvas.getByTestId('password'), '12345');
    await userEvent.type(canvas.getByTestId('confirmPassword'), '12345');
    await waitFor(() => expect(canvas.getByRole('button', { name: /register/i })).toBeEnabled());
  },
};

export const CantSubmitWithErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('email'), 'hello');
    await waitFor(() => expect(canvas.getByRole('button', { name: /register/i })).toBeDisabled());
  },
};
