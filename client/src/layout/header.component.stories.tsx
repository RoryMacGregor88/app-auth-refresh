import { Meta, StoryObj } from '@storybook/react';

import { Header } from './header.component';

const meta: Meta<typeof Header> = {
  title: 'Components/OneOff/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ShowComponent: Story = {
  args: {},
};
